import { Telegraf, Markup } from 'telegraf';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import https from 'https';
import { getLangText } from './locales.js';
import { run, getOne } from '../db/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Memory store for user multi-step dialog state
const userState = {};

export const initBot = (token) => {
  if (!token || token === 'YOUR_TELEGRAM_BOT_TOKEN_HERE') {
    console.warn('⚠️ WARNING: Telegram BOT_TOKEN is not set in .env. Bot runner disabled until valid token is provided.');
    return null;
  }

  const bot = new Telegraf(token);

  // Helper to get or init user session
  const getSession = (ctx) => {
    const id = ctx.from.id;
    if (!userState[id]) {
      userState[id] = {
        lang: 'uz',
        step: 'IDLE',
        data: {}
      };
    }
    return userState[id];
  };

  // Helper to send language selection
  const sendLangSelect = async (ctx) => {
    await ctx.reply(
      "Tilni tanlang / Select language / Выберите язык:",
      Markup.inlineKeyboard([
        [
          Markup.button.callback("🇺🇿 O'zbekcha", "set_lang_uz"),
          Markup.button.callback("🇷🇺 Русский", "set_lang_ru"),
          Markup.button.callback("🇬🇧 English", "set_lang_en")
        ]
      ])
    );
  };

  // Helper to send main menu
  const sendMainMenu = async (ctx, lang) => {
    await ctx.reply(
      getLangText(lang, 'welcome'),
      Markup.keyboard([
        [getLangText(lang, 'btn_start_appeal')],
        [getLangText(lang, 'btn_change_lang')]
      ]).resize()
    );
  };

  // Command /start & /restart
  bot.command(['start', 'restart'], async (ctx) => {
    const session = getSession(ctx);
    session.step = 'IDLE';
    session.data = {};
    await sendLangSelect(ctx);
  });

  // Action: Language selected via inline keyboard
  bot.action(/^set_lang_(uz|ru|en)$/, async (ctx) => {
    const lang = ctx.match[1];
    const session = getSession(ctx);
    session.lang = lang;
    session.step = 'IDLE';
    await ctx.answerCbQuery();
    await ctx.reply(`✅ Selected: ${lang.toUpperCase()}`);
    await sendMainMenu(ctx, lang);
  });

  // Helper: Download photo from Telegram server
  const downloadTelegramPhoto = async (bot, fileId) => {
    try {
      const fileUrl = await bot.telegram.getFileLink(fileId);
      const filename = `appeal_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
      const localPath = path.join(uploadsDir, filename);

      return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(localPath);
        https.get(fileUrl.href, (response) => {
          response.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            resolve(`/uploads/${filename}`);
          });
        }).on('error', (err) => {
          fs.unlink(localPath, () => {});
          reject(err);
        });
      });
    } catch (err) {
      console.error('Failed to download Telegram photo:', err);
      return null;
    }
  };

  // Handle Text & Keyboard buttons
  bot.on('text', async (ctx) => {
    const text = ctx.message.text.trim();
    const session = getSession(ctx);
    const lang = session.lang;

    // Check menu buttons
    if (text === getLangText('uz', 'btn_change_lang') || 
        text === getLangText('ru', 'btn_change_lang') || 
        text === getLangText('en', 'btn_change_lang') ||
        text === '🌐 Tilni o\'zgartirish') {
      return sendLangSelect(ctx);
    }

    if (text === getLangText('uz', 'btn_start_appeal') || 
        text === getLangText('ru', 'btn_start_appeal') || 
        text === getLangText('en', 'btn_start_appeal') ||
        text.includes('Murojaat yuborish') || text.includes('Отправить обращение') || text.includes('Send appeal')) {
      
      session.step = 'AWAITING_FULL_NAME';
      session.data = { is_anonymous: 0 };

      return ctx.reply(
        getLangText(lang, 'ask_full_name'),
        Markup.removeKeyboard()
      );
    }

    // Step handling
    if (session.step === 'AWAITING_FULL_NAME') {
      session.data.full_name = text;
      session.step = 'AWAITING_PHONE';

      return ctx.reply(
        getLangText(lang, 'ask_phone'),
        Markup.keyboard([
          [Markup.button.contactRequest(getLangText(lang, 'btn_send_phone'))]
        ]).resize()
      );
    }

    if (session.step === 'AWAITING_PHONE') {
      session.data.phone_number = text;
      session.data.is_anonymous = 0;

      session.step = 'AWAITING_CATEGORY';
      return ctx.reply(
        getLangText(lang, 'ask_category'),
        Markup.keyboard([
          [getLangText(lang, 'cat_corruption')],
          [getLangText(lang, 'cat_system')]
        ]).resize()
      );
    }

    if (session.step === 'AWAITING_CATEGORY') {
      let catKey = 'system';
      if (text.includes('Korrupsion') || text.includes('Коррупция') || text.includes('Corruption')) {
        catKey = 'corruption';
      }

      session.data.category = text;
      session.data.category_key = catKey;
      session.step = 'AWAITING_TEXT';

      return ctx.reply(
        getLangText(lang, 'ask_text'),
        Markup.removeKeyboard()
      );
    }

    if (session.step === 'AWAITING_TEXT') {
      session.data.text = text;
      session.step = 'AWAITING_CONFIRMATION';

      const summary = 
        `${getLangText(lang, 'confirm_title')}` +
        `👤 **F.I.SH:** ${session.data.full_name}\n` +
        `📌 **Kategoriya:** ${session.data.category}\n` +
        `📞 **Telefon:** ${session.data.phone_number}\n` +
        `✍️ **Matn:** ${session.data.text}\n` +
        `${getLangText(lang, 'confirm_ask')}`;

      return ctx.reply(
        summary,
        {
          parse_mode: 'Markdown',
          ...Markup.keyboard([
            [getLangText(lang, 'btn_confirm_yes')],
            [getLangText(lang, 'btn_confirm_no')]
          ]).resize()
        }
      );
    }

    if (session.step === 'AWAITING_CONFIRMATION') {
      if (text === getLangText(lang, 'btn_confirm_yes') || text.includes('Tasdiqlayman') || text.includes('Подтверждаю') || text.includes('Confirm')) {
        session.step = 'AWAITING_PHOTO';

        return ctx.reply(
          getLangText(lang, 'ask_photo'),
          Markup.keyboard([
            [getLangText(lang, 'btn_skip_photo')]
          ]).resize()
        );
      } else {
        session.step = 'IDLE';
        session.data = {};
        await ctx.reply(getLangText(lang, 'cancel_msg'), Markup.removeKeyboard());
        return sendMainMenu(ctx, lang);
      }
    }

    if (session.step === 'AWAITING_PHOTO') {
      if (text === getLangText(lang, 'btn_skip_photo') || text.includes('O‘tkazib') || text.includes('Пропустить') || text.includes('Skip')) {
        return finalizeAppeal(ctx, session, null, null, bot);
      }
    }
  });

  // Handle Contact button share
  bot.on('contact', async (ctx) => {
    const session = getSession(ctx);
    const lang = session.lang;

    if (session.step === 'AWAITING_PHONE') {
      const phoneNumber = ctx.message.contact.phone_number;
      session.data.phone_number = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      session.data.is_anonymous = 0;

      session.step = 'AWAITING_CATEGORY';
      return ctx.reply(
        getLangText(lang, 'ask_category'),
        Markup.keyboard([
          [getLangText(lang, 'cat_corruption')],
          [getLangText(lang, 'cat_system')]
        ]).resize()
      );
    }
  });

  // Handle Photo upload
  bot.on('photo', async (ctx) => {
    const session = getSession(ctx);
    const lang = session.lang;

    if (session.step === 'AWAITING_PHOTO') {
      const photos = ctx.message.photo;
      const largestPhoto = photos[photos.length - 1]; // highest resolution photo
      
      await ctx.reply("⏳ Rasm yuklanmoqda...");
      const photoPath = await downloadTelegramPhoto(bot, largestPhoto.file_id);

      return finalizeAppeal(ctx, session, photoPath, largestPhoto.file_id, bot);
    }
  });

  // Finalize Appeal saving logic
  const finalizeAppeal = async (ctx, session, photoPath, telegramPhotoId, botInstance) => {
    const lang = session.lang;
    const trackingId = `#APP-${Math.floor(100000 + Math.random() * 900000)}`;
    const telegramId = String(ctx.from.id);
    const username = ctx.from.username || '';
    const firstName = ctx.from.first_name || '';

    try {
      await run(
        `INSERT INTO appeals 
         (tracking_id, telegram_id, username, first_name, full_name, phone_number, is_anonymous, language, category, category_key, text, photo_path, telegram_photo_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          trackingId,
          telegramId,
          username,
          session.data.full_name || firstName || '',
          session.data.full_name || firstName || '',
          session.data.phone_number || '',
          0,
          lang,
          session.data.category,
          session.data.category_key,
          session.data.text,
          photoPath || null,
          telegramPhotoId || null
        ]
      );

      // Reset step
      session.step = 'IDLE';
      session.data = {};

      await ctx.reply(
        `${getLangText(lang, 'success')}${trackingId}`,
        Markup.removeKeyboard()
      );

      await sendMainMenu(ctx, lang);

    } catch (err) {
      console.error('Failed to save appeal:', err);
      await ctx.reply("❌ Murojaatni saqlashda xatolik yuz berdi. Qayta urinib ko'ring.");
    }
  };

  bot.launch().then(() => {
    console.log('🤖 Telegram Bot launched successfully and listening for messages!');
  }).catch((err) => {
    console.error('Error starting Telegram Bot:', err.message);
  });

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  return bot;
};
