import { Bot } from 'grammy';
import { BotContext } from '../../../common/types/context.type';
import { AuthStep } from '../enums/auth.step';
import { sendAuthSms } from '../../../api/auth.api';

export function handleGetContactFlow(bot: Bot<BotContext>) {
  bot.on('message:contact', async (ctx, next) => {
    const session = ctx.session;

    if (session.step !== AuthStep.RequestContact) return next();

    const phone = '0' + ctx.message.contact.phone_number.slice(3);
    const result = await sendAuthSms(phone);

    if (!result.isSuccess) return ctx.reply('مشکلی در ارسال پیامک پیش آمده لطفا بعدا تلاش نمایید.');

    ctx.session.step = AuthStep.PhoneAuthenticateCode;
    ctx.session.data = { phone };

    await ctx.reply('کد شش رقمی به شماره موبایل شماره ارسال شده است لطفا‌ آن را وارد کنید:');
  });
}
