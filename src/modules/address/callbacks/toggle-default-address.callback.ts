import { Bot } from 'grammy';
import { setDefaultAddress, updateAddress } from '../../../api/address.api';
import { authMiddleware } from '../../../common/middlewares/auth.middleware';
import { BotContext } from '../../../common/types/context.type';
import { addressDetailMenuKeyboard } from '../address.keyboard';
import { AddressMenuCallbackData } from '../enums/address-callback-data.enum';
import { setAddressDetails } from './details-address.callback';

export function toggleDefaultAddressCallbacks(bot: Bot<BotContext>) {
  const SET_DEFAULT_PREFIX = AddressMenuCallbackData.SetDefault;

  //* Set address callback query
  bot.callbackQuery(new RegExp(`^${SET_DEFAULT_PREFIX}(\\d+)$`), authMiddleware, async (ctx, next) => {
    const addressId = Number(ctx.match[1]);

    if (!addressId) return await next();

    const { isSuccess, address } = await setDefaultAddress(ctx.session.accessToken, addressId);

    if (!isSuccess) return ctx.reply('مشکلی پیش آمد لطفا بعدا امتحان کنید.');

    const message = setAddressDetails(address);

    await ctx.answerCallbackQuery('به عنوان آدرس پیشفرض ذخیره شد.');

    await ctx.editMessageText(message, { parse_mode: 'Markdown', reply_markup: addressDetailMenuKeyboard(addressId, true) });
  });

  //* Unset address callback query
  const UNSET_DEFAULT_ADDRESS = AddressMenuCallbackData.UnsetDefault;

  bot.callbackQuery(new RegExp(`^${UNSET_DEFAULT_ADDRESS}(\\d+)$`), authMiddleware, async (ctx, next) => {
    const addressId = Number(ctx.match[1]);

    if (!addressId) return await next();

    const { isSuccess, address } = await updateAddress(ctx.session.accessToken, addressId, { isDefault: false });

    if (!isSuccess) return ctx.reply('مشکلی پیش آمد لطفا بعدا امتحان کنید.');

    const message = setAddressDetails(address);

    await ctx.answerCallbackQuery('از تنظیم پیشفرض حذف شد.');

    await ctx.editMessageText(message, { parse_mode: 'Markdown', reply_markup: addressDetailMenuKeyboard(addressId, false) });
  });
}
