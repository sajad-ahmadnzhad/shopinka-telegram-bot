import { Bot } from 'grammy';
import { BotContext } from '../../../common/types/context.type';
import { authMiddleware } from '../../../common/middlewares/auth.middleware';
import { backToAddressList, useProfileFullNameKeyboard } from '../address.keyboard';
import { AddressMessages } from '../enums/address.message';
import { CreateAddressStep } from '../enums/address.step';
import { AddressMenuCallbackData } from '../enums/address-callback-data.enum';
import { createAddress } from '../../../api/address.api';
import { yesNoInlineKeyboard } from '../../../common/keyboards/shared.keyboard';
import { getMe } from '../../../api/user.api';

export function createAddressCallbacks(bot: Bot<BotContext>) {
  //* Create new address
  bot.callbackQuery(AddressMenuCallbackData.CreateNew, authMiddleware, async (ctx) => {
    ctx.session.step = CreateAddressStep.FullName;
    ctx.session.data = {};

    ctx.editMessageText(AddressMessages.EnterFullName, { reply_markup: useProfileFullNameKeyboard() });
  });

  //* Skip unit address callback
  bot.callbackQuery(AddressMenuCallbackData.SkipUnit, authMiddleware, async (ctx) => {
    const session = ctx.session;
    await ctx.answerCallbackQuery();

    if (session.step == CreateAddressStep.Unit) {
      session.step = CreateAddressStep.SetDefault;

      return await ctx.editMessageText(AddressMessages.AskDefault, { reply_markup: yesNoInlineKeyboard() });
    }
  });

  //* Use profile fullname callback
  bot.callbackQuery(AddressMenuCallbackData.UseProfileFullName, authMiddleware, async (ctx, next) => {
    const session = ctx.session;

    if (session.step == 'idle') {
      await ctx.answerCallbackQuery('عملیات کنسل شده.');
      return await next();
    }

    const user = await getMe(ctx.session.accessToken);

    if (!user.isSuccess) return ctx.reply('مشکلی پیش آمد لطفا بعدا امتحان کنید.');

    if (!user.data?.fullName) return ctx.editMessageText('نام شما در پروفایل تان تنظیم نشده. لطفا نام خود به صورت دستی وارد نمایید:');

    await ctx.answerCallbackQuery();
    session.data.fullName = user.data.fullName;
    session.step = CreateAddressStep.Province;

    await ctx.editMessageText(`نام کامل انتخاب شده: ${user.data.fullName}`);

    return await ctx.reply(AddressMessages.EnterProvince);
  });

  //* Set default address (yes|no)
  bot.callbackQuery(['yes', 'no'], authMiddleware, async (ctx, next) => {
    const session = ctx.session;

    await ctx.answerCallbackQuery();

    if (session.step == 'idle' || session.step !== CreateAddressStep.SetDefault) return await next();

    if (session.step == CreateAddressStep.SetDefault) session.data.isDefault = true;

    const result = await createAddress(session.accessToken, session.data);

    if (!result.isSuccess) return ctx.reply(result.message);

    session.step = 'idle';
    session.data = {};

    return await ctx.editMessageText(`${result.message}✅`, { reply_markup: backToAddressList() });
  });
}
