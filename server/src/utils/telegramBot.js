const TelegramBot = require('node-telegram-bot-api');
const prisma = require('../config/db');

const token = process.env.TELEGRAM_BOT_TOKEN;
let bot = null;

// Only start the bot if the token exists in the .env file
if (token && token !== "paste_your_long_token_here") {
  bot = new TelegramBot(token, { polling: true });

  console.log("🤖 Telegram Bot is awake and listening...");

  // When a parent types: /start +251911234567
  bot.onText(/\/start (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const phone = match[1]; // The phone number they typed

    try {
      // Find the parent by phone number and save their Telegram Chat ID!
      const user = await prisma.user.update({
        where: { phone: phone },
        data: { telegramChatId: chatId.toString() }
      });

      bot.sendMessage(chatId, `✅ Welcome! Your account is successfully linked. You will now receive instant school alerts for your children here.`);
      console.log(`Linked Telegram ID ${chatId} to Phone ${phone}`);
      
    } catch (error) {
      bot.sendMessage(chatId, `❌ Sorry, we couldn't find a registered parent with the phone number: ${phone}. Make sure you include the country code (e.g., +251...).`);
    }
  });
} else {
  console.log("⚠️ Telegram Bot Token missing. Bot is sleeping.");
}

// The function we will call from our controllers to send alerts!
const sendTelegramAlert = async (chatId, message) => {
  if (bot && chatId) {
    try {
      await bot.sendMessage(chatId, message);
    } catch (error) {
      console.error("Failed to send Telegram message:", error.message);
    }
  }
};

module.exports = { sendTelegramAlert };