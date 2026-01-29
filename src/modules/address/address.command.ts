import { Bot } from 'grammy';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import { BotContext } from '../../common/types/context.type';
import { addressMenuKeyboard, backToAddressList } from './address.keyboard';
import { AddressReplyMessages } from './enums/address.message';
import { CreateAddressStep } from './enums/address.step';

export function registerAddressCommand(bot: Bot<BotContext>) {
  bot.command('address', authMiddleware, async (ctx) => {
    ctx.reply(AddressReplyMessages.ChoseOption, { reply_markup: addressMenuKeyboard() });
  });
}

export function registerCancelAddressCommand(bot: Bot<BotContext>) {
  bot.command('cancel', async (ctx, next) => {
    const session = ctx.session;

    const createAddressStepValues = Object.values(CreateAddressStep);

    if (!createAddressStepValues.includes(ctx.session.step as any)) return await next();

    session.step = 'idle';
    session.data = {};

    return await ctx.reply('فرایند ساخت آدرس لغو شد.', { reply_markup: backToAddressList() });
  });
}
