import { Bot } from 'grammy';
import { BotContext } from '../../common/types/context.type';

export function registerStartCommand(bot: Bot<BotContext>) {
  bot.command('start', async (ctx) => {
    ctx.session.step = 'idle';
    ctx.session.data = {};

    await ctx.reply(`👋 سلام ${ctx.from?.first_name || ''}

به ربات فروشگاهی خوش اومدی 🛒
از /help استفاده کن تا راهنما رو ببینی`);
  });
}
