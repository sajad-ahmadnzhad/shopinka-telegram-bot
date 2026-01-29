import { Bot } from 'grammy';
import { BotContext } from '../../../common/types/context.type';
import { AddressMenuCallbackData } from '../enums/address-callback-data.enum';
import { authMiddleware } from '../../../common/middlewares/auth.middleware';
import { cancelUpdateAddressKeyboard, updateAddressKeyboard } from '../address.keyboard';
import { UpdateAddressStep } from '../enums/address.step';

export function updateAddressCallbacks(bot: Bot<BotContext>) {
  const UPDATE_ADDRESS_PREFIX = AddressMenuCallbackData.Update;

  bot.callbackQuery(new RegExp(`^${UPDATE_ADDRESS_PREFIX}(\\d+)$`), authMiddleware, async (ctx) => {
    const addressId = Number(ctx.match[1]);

    ctx.session.data.addressId = addressId;
    ctx.session.step = UpdateAddressStep.Update;

    return ctx.editMessageText('گزینه مورد نظر را برای ویرایش انتخاب کنید:', { reply_markup: updateAddressKeyboard(addressId) });
  });

  bot.callbackQuery(AddressMenuCallbackData.CancelUpdate, authMiddleware, async (ctx) => {
    ctx.session.step = UpdateAddressStep.Update;
    await ctx.deleteMessage();
  });

  bot.callbackQuery(/^update_address_(\w+)$/, authMiddleware, async (ctx, next) => {
    const callbackData = ctx.match[0];
    const addressId = ctx.session.data.addressId;

    await ctx.answerCallbackQuery();

    if (!addressId) return await next();

    const reply_markup = { reply_markup: cancelUpdateAddressKeyboard() };

    switch (callbackData) {
      case AddressMenuCallbackData.UpdateFullName:
        ctx.session.step = AddressMenuCallbackData.UpdateFullName;
        return ctx.reply('نام کامل جدید را وارد نمایید:', reply_markup);

      case AddressMenuCallbackData.UpdateProvince:
        ctx.session.step = AddressMenuCallbackData.UpdateProvince;
        return ctx.reply('نام استان جدید را وارد نمایید:', reply_markup);

      case AddressMenuCallbackData.UpdateCity:
        ctx.session.step = AddressMenuCallbackData.UpdateCity;
        return ctx.reply('نام شهر جدید را وارد نمایید:', reply_markup);

      case AddressMenuCallbackData.UpdateBuildingNumber:
        ctx.session.step = AddressMenuCallbackData.UpdateBuildingNumber;
        return ctx.reply('شماره ساختمان جدید را وارد نمایید:', reply_markup);

      case AddressMenuCallbackData.UpdateUnit:
        ctx.session.step = AddressMenuCallbackData.UpdateUnit;
        return ctx.reply('واحد جدید را وارد نمایید:', reply_markup);

      case AddressMenuCallbackData.UpdatePostalAddress:
        ctx.session.step = AddressMenuCallbackData.UpdatePostalAddress;
        return ctx.reply('آدرس پستی جدید را وارد نمایید:', reply_markup);

      case AddressMenuCallbackData.UpdatePostalCode:
        ctx.session.step = AddressMenuCallbackData.UpdatePostalCode;
        return ctx.reply('کد پستی جدید را وارد نمایید:', reply_markup);

      default:
        return await next();
    }
  });
}
