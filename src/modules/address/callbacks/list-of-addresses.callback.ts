import { Bot, InlineKeyboard } from 'grammy';
import { BotContext } from '../../../common/types/context.type';
import { AddressMenuCallbackData } from '../enums/address-callback-data.enum';
import { authMiddleware } from '../../../common/middlewares/auth.middleware';
import { getAllAddresses } from '../../../api/address.api';
import { addressMenuKeyboard, createNewAddressKeyboard } from '../address.keyboard';
import { AddressReplyMessages } from '../enums/address.message';
import { SharedCallbackData } from '../../../common/enums/shared-callback-data.enum';
import { GetAddressListStep } from '../enums/address.step';

export function listOfAddressesCallback(bot: Bot<BotContext>) {
  bot.callbackQuery(AddressMenuCallbackData.List, authMiddleware, async (ctx) => {
    const { isSuccess, data: addresses } = await getAllAddresses(ctx.session.accessToken);

    await ctx.answerCallbackQuery();

    if (!isSuccess) return ctx.reply('مشکلی پیش آمد. بعدا امتحان کنید.');

    if (addresses.length == 0) {
      ctx.session.step = GetAddressListStep.CreateNewAddress;
      return ctx.editMessageText('هنوز آدرسی برای شما ساخته نشده.', { reply_markup: createNewAddressKeyboard() });
    }

    const inlineKeyboard = new InlineKeyboard();

    for (let i = 0; i < addresses.length; i += 2) {
      const first = addresses[i];
      const second = addresses[i + 1];

      inlineKeyboard.text(`${first.province}, ${first.city}`, `${AddressMenuCallbackData.ShowDetails}${first.id}`);

      if (second) {
        inlineKeyboard.text(`${second.province}, ${second.city}`, `${AddressMenuCallbackData.ShowDetails}${second.id}`);
      }

      inlineKeyboard.row();
    }

    inlineKeyboard.text('بازگشت', AddressMenuCallbackData.BackToMain);

    const defaultAddress = addresses.find((a) => a.isDefault);

    const replyMessage = `لیست‌ آدرس ها:\n\nآدرس پیشفرض: ${defaultAddress ? `${defaultAddress.province}, ${defaultAddress.city}` : 'انتخاب نشده.'}`;

    ctx.editMessageText(replyMessage, { reply_markup: inlineKeyboard });
  });

  bot.callbackQuery(AddressMenuCallbackData.BackToMain, authMiddleware, (ctx) => {
    ctx.editMessageText(AddressReplyMessages.ChoseOption, { reply_markup: addressMenuKeyboard() });
  });

  bot.callbackQuery(SharedCallbackData.Close, async (ctx, next) => {
    if (ctx.session.step !== GetAddressListStep.CreateNewAddress) return next();

    ctx.session.step = 'idle';
    ctx.session.data = {};

    ctx.editMessageText('با موفقیت بسته شد.');
  });

  bot.callbackQuery(AddressMenuCallbackData.CloseMainMenu, authMiddleware, (ctx) => {
    ctx.answerCallbackQuery();
    ctx.editMessageText('صفحه‌ آدرس ها با موفقیت بسته شد.');
  });
}
