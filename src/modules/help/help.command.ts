import { Bot } from 'grammy';
import { BotContext } from '../../common/types/context.type';

export function registerHelpCommand(bot: Bot<BotContext>) {
  bot.command('help', async (ctx) => {
    ctx.session.step = 'idle';
    ctx.session.data = {};

    ctx.reply(`📌 راهنمای ربات:

/start - شروع ربات
/help - نمایش راهنما

🛒 به زودی:
- مشاهده محصولات
- سبد خرید
- پرداخت آنلاین`);
  });
}
