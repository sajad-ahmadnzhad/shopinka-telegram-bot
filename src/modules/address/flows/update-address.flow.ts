import { Bot } from 'grammy';
import { BotContext } from '../../../common/types/context.type';
import { AddressMenuCallbackData } from '../enums/address-callback-data.enum';
import { updateAddress } from '../../../api/address.api';
import { addressSchema } from '../address.schema';
import { validateStep } from '../../../common/utils/validate-schema.utils';

export async function handelUpdateAddressFlow(bot: Bot<BotContext>) {
  bot.on('message:text', async (ctx, next) => {
    const { step, data } = ctx.session;
    const { text } = ctx.message;

    switch (step) {
      case AddressMenuCallbackData.UpdateFullName:
        const fullName = validateStep(addressSchema.fullName, text, ctx);
        if (!fullName) return;

        await updateAddress(ctx.session.accessToken, data.addressId, { fullName: text });
        return ctx.reply('نام کامل شما با موفقیت بروز شد.');

      case AddressMenuCallbackData.UpdateProvince:
        const province = validateStep(addressSchema.province, text, ctx);
        if (!province) return;

        await updateAddress(ctx.session.accessToken, data.addressId, { province: text });
        return ctx.reply('استان شما با موفقیت بروز شد.');

      case AddressMenuCallbackData.UpdateCity:
        const city = validateStep(addressSchema.city, text, ctx);
        if (!city) return;

        await updateAddress(ctx.session.accessToken, data.addressId, { city: text });
        return ctx.reply('شهر شما با موفقیت بروز شد.');

      case AddressMenuCallbackData.UpdateBuildingNumber:
        const buildingNumber = validateStep(addressSchema.buildingNumber, +text, ctx);
        if (!buildingNumber) return;

        await updateAddress(ctx.session.accessToken, data.addressId, { buildingNumber: +text });
        return ctx.reply('شماره ساختمان شما با موفقیت بروز شد.');

      case AddressMenuCallbackData.UpdateUnit:
        const unit = validateStep(addressSchema.unit, +text, ctx);
        if (!unit) return;

        await updateAddress(ctx.session.accessToken, data.addressId, { unit: +text });
        return ctx.reply('واحد شما با موفقیت بروز شد.');

      case AddressMenuCallbackData.UpdatePostalAddress:
        const postalAddress = validateStep(addressSchema.postalAddress, text, ctx);
        if (!postalAddress) return;

        await updateAddress(ctx.session.accessToken, data.addressId, { postalAddress: text });
        return ctx.reply('آدرس پستی شما با موفقیت بروز شد.');

      case AddressMenuCallbackData.UpdatePostalCode:
        const postalCode = validateStep(addressSchema.postalCode, text, ctx);
        if (!postalCode) return;

        await updateAddress(ctx.session.accessToken, data.addressId, { postalCode: text });
        return ctx.reply('کد پستی شما با موفقیت بروز شد.');

      default:
        return await next();
    }
  });
}
