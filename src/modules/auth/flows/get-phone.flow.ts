import { Bot } from 'grammy';
import { BotContext } from '../../../common/types/context.type';
import { AuthStep } from '../enums/auth.step';
import { sendAuthSms } from '../../../api/auth.api';
import { normalizePhone } from '../../../common/utils/functions.utils';
import { validateStep } from '../../../common/utils/validate-schema.utils';
import { phoneSchema } from '../auth.schema';

export function handleGetPhone(bot: Bot<BotContext>) {
  bot.on('message:text', async (ctx, next) => {
    const session = ctx.session;
    let text = ctx.message.text;

    if (session.step !== AuthStep.RequestContact) return next();

    const phone = normalizePhone(text);

    const validPhone = validateStep(phoneSchema, phone, ctx);

    if (!validPhone) return;

    const result = await sendAuthSms(text);

    if (!result.isSuccess) return ctx.reply('مشکلی پیش آمد. بعدا امتحان کنید.');

    ctx.session.step = AuthStep.PhoneAuthenticateCode;
    ctx.session.data = { phone: text };
    return await ctx.reply('کد شش رقمی به موبایل شما ارسال شده است. لطفا آن را وارد کنید:');
  });
}
