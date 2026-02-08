import { Bot } from 'grammy';
import { BotContext } from '../../common/types/context.type';
import { AddProductCommentStep } from './enums/product.step';
import { SharedNormalKeyboardMessage } from '../../common/enums/shared-keyboard.message';

export function handleProductHears(bot: Bot<BotContext>) {
  bot.hears(SharedNormalKeyboardMessage.Cancel, async (ctx, next) => {
    const session = ctx.session;

    const steps: string[] = Object.values(AddProductCommentStep);

    if (!steps.includes(session.step)) return await next();

    ctx.session.step = 'idle';
    ctx.session.data = {};

    return await ctx.reply('ساخت کامنت با موفقیت لغو شد.', { reply_markup: { remove_keyboard: true } });
  });
}
