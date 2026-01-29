import { Bot } from 'grammy';
import { getOneAddress } from '../../../api/address.api';
import { authMiddleware } from '../../../common/middlewares/auth.middleware';
import { BotContext } from '../../../common/types/context.type';
import { addressDetailMenuKeyboard } from '../address.keyboard';
import { AddressMenuCallbackData } from '../enums/address-callback-data.enum';
import { IAddressInfo } from '../address.interface';

export function setAddressDetails(address: IAddressInfo) {
  return `
📍 *جزئیات آدرس*

👤 *نام گیرنده:* ${address.fullName}

🏙 *استان / شهر:* ${address.province} - ${address.city}

🏠 *آدرس:* ${address.postalAddress}

📮 *کد پستی:* ${address.postalCode ?? '—'}

🚪 *واحد:* ${address.unit ?? 'تنظیم نشده'}

🏪 *شماره ساختمان:* ${address.buildingNumber}

🟢 *تنظیم شده به عنوان پیش فرض:* ${address.isDefault ? 'بله' : 'خیر'}
`.trim();
}

export function detailsAddressCallbacks(bot: Bot<BotContext>) {
  const SHOW_DETAILS_PREFIX = AddressMenuCallbackData.ShowDetails;

  bot.callbackQuery(new RegExp(`^${SHOW_DETAILS_PREFIX}(\\d+)$`), authMiddleware, async (ctx, next) => {
    const addressId = Number(ctx.match[1]);
    await ctx.answerCallbackQuery();

    if (!addressId) return await next();
    const { isSuccess, data: address } = await getOneAddress(ctx.session.accessToken, addressId);

    if (!isSuccess) return ctx.reply('مشکلی پیش آمد. لطفا بعدا امتحان کنید.');

    const message = setAddressDetails(address);

    await ctx.editMessageText(message, { parse_mode: 'Markdown', reply_markup: addressDetailMenuKeyboard(addressId, address.isDefault) });
  });
}
