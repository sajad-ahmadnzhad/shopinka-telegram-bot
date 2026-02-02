import { Bot, Keyboard } from 'grammy';
import { BotContext } from '../../common/types/context.type';
import { env } from '../../configs/env.config';

export function registerStartCommand(bot: Bot<BotContext>) {
  bot.command('start', async (ctx) => {
    ctx.session.step = 'idle';
    ctx.session.data = {};

    if (env.SUPER_ADMIN_CHAT_ID === ctx.from.id) {
      return await ctx.reply(`سلام مدیر جان خوش برگشتی.\n\nاز دکمه های پایین برای ادامه استفاده کن.`, {
        reply_markup: new Keyboard().text('عضویت اجباری').resized().oneTime(true),
      });
    }

    await ctx.reply(`👋 سلام ${ctx.from?.first_name || ''}

به ربات فروشگاهی خوش اومدی 🛒
از /help استفاده کن تا راهنما رو ببینی`);
  });
}
