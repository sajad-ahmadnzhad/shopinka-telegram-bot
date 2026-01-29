import { CreateAddressStep } from '../enums/address.step';
import { AddressMessages } from '../enums/address.message';
import { BotContext } from '../../../common/types/context.type';
import { skipUnitKeyboard } from '../address.keyboard';
import { Bot } from 'grammy';
import { addressSchema } from '../address.schema';
import { validateStep } from '../../../common/utils/validate-schema.utils';
import { yesNoInlineKeyboard } from '../../../common/keyboards/shared.keyboard';

export async function handleCreateAddressFlow(bot: Bot<BotContext>) {
  bot.on('message:text', async (ctx, next) => {
    const { step, data } = ctx.session;
    const text = ctx.message.text;

    switch (step) {
      case CreateAddressStep.FullName:
        const fullName = validateStep(addressSchema.fullName, text, ctx);
        if (!fullName) return;

        data.fullName = text;
        ctx.session.step = CreateAddressStep.Province;
        return ctx.reply(AddressMessages.EnterProvince);

      case CreateAddressStep.Province:
        const province = validateStep(addressSchema.province, text, ctx);
        if (!province) return;

        data.province = text;
        ctx.session.step = CreateAddressStep.City;
        return ctx.reply(AddressMessages.EnterCity);

      case CreateAddressStep.City:
        const city = validateStep(addressSchema.city, text, ctx);
        if (!city) return;

        data.city = text;
        ctx.session.step = CreateAddressStep.BuildingNumber;
        return ctx.reply(AddressMessages.EnterBuildingNumber);

      case CreateAddressStep.BuildingNumber:
        const buildingNumber = validateStep(addressSchema.buildingNumber, +text, ctx);
        if (!buildingNumber) return;

        data.buildingNumber = Number(text);
        ctx.session.step = CreateAddressStep.PostalCode;
        return ctx.reply(AddressMessages.EnterPostalCode);

      case CreateAddressStep.PostalCode:
        const postalCode = validateStep(addressSchema.postalCode, text, ctx);
        if (!postalCode) return;

        data.postalCode = text;
        ctx.session.step = CreateAddressStep.PostalAddress;
        return ctx.reply(AddressMessages.EnterPostalAddress);

      case CreateAddressStep.PostalAddress:
        const postalAddress = validateStep(addressSchema.postalAddress, text, ctx);
        if (!postalAddress) return;

        data.postalAddress = text;
        ctx.session.step = CreateAddressStep.Unit;
        return ctx.reply(AddressMessages.EnterUnit, { reply_markup: skipUnitKeyboard() });

      case CreateAddressStep.Unit:
        const unit = validateStep(addressSchema.unit, +text, ctx);
        if (!unit) return;

        data.unit = Number(text);
        ctx.session.step = CreateAddressStep.SetDefault;
        return await ctx.reply(AddressMessages.AskDefault, { reply_markup: yesNoInlineKeyboard() });

      default:
        return await next();
    }
  });
}
