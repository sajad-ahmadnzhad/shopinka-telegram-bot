import { Bot } from 'grammy';
import { BotContext } from '../../../common/types/context.type';
import { AddressMenuCallbackData } from '../enums/address-callback-data.enum';
import { authMiddleware } from '../../../common/middlewares/auth.middleware';
import { backToAddressList } from '../address.keyboard';
import { RemoveAddressStep } from '../enums/address.step';
import { removeAddress } from '../../../api/address.api';
import { yesNoInlineKeyboard } from '../../../common/keyboards/shared.keyboard';

export function removeAddressCallbacks(bot: Bot<BotContext>) {
  const REMOVE_ADDRESS_PREFIX = AddressMenuCallbackData.Remove;

  bot.callbackQuery(new RegExp(`^${REMOVE_ADDRESS_PREFIX}(\\d+)$`), authMiddleware, async (ctx, next) => {
    const addressId = Number(ctx.match[1]);
    await ctx.answerCallbackQuery();

    if (!addressId) return await next();

    ctx.session.step = RemoveAddressStep.Remove;
    ctx.session.data = { addressId };

    ctx.editMessageText('آیا از حذف این آدرس اطمینان دارید؟', { reply_markup: yesNoInlineKeyboard() });
  });

  bot.callbackQuery(['yes', 'no'], authMiddleware, async (ctx, next) => {
    const session = ctx.session;
    const match = ctx.match;

    if (session.step !== RemoveAddressStep.Remove) return await next();

    if (match == 'yes') {
      const { isSuccess } = await removeAddress(session.accessToken, session.data.addressId);
      if (!isSuccess) return ctx.reply('مشکلی پیش آمد. لطفا بعدا امتحان کنید.');

      ctx.editMessageText('آدرس مورد نظر با موفقیت حذف شد.', { reply_markup: backToAddressList() });
      session.data = {};
      session.step = 'idle';
      return;
    }

    ctx.editMessageText('عملیات حذف آدرس کنسل شد.', { reply_markup: backToAddressList() });
    session.data = {};
    session.step = 'idle';
  });
}
