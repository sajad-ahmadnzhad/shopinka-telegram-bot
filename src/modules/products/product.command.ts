import { Bot } from 'grammy';
import { BotContext } from 'src/common/types/context.type';
import { productMenuKeyboard } from './product.keyboard';

export function registerProductCommand(bot: Bot<BotContext>) {
  bot.command('product', async (ctx) => {
    ctx.session.step = 'idle';
    ctx.session.data = {};

    return await ctx.reply('به بخش محصولات خوش آمدید. گزینه مورد نظر را انتخاب کنید.', { reply_markup: productMenuKeyboard() });
  });
}
