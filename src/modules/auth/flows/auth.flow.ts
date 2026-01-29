import { Bot } from 'grammy';
import { BotContext } from '../../../common/types/context.type';
import { AuthStep } from '../enums/auth.step';
import { checkAuthSms } from '../../../api/auth.api';
import { editProfile } from '../../../api/user.api';
import { storeAuthTokens } from '../../../common/utils/store-auth-tokens.utils';
import { otpCodeLengthSchema, otpCodeSchema } from '../auth.schema';
import { validateStep } from '../../../common/utils/validate-schema.utils';

export function handleAuthFlow(bot: Bot<BotContext>) {
  bot.on('message:text', async (ctx, next) => {
    let text = ctx.message.text;
    const session = ctx.session;
    let firsName = ctx.from.first_name;

    if (session.step !== AuthStep.PhoneAuthenticateCode) return await next();

    const validOtpLength = validateStep(otpCodeLengthSchema, text, ctx);
    const validateOtp = validateStep(otpCodeSchema, +text, ctx);

    if (!validOtpLength || !validateOtp) return;

    const result = await checkAuthSms(session.data.phone, text);

    if (!result.isSuccess) return ctx.reply('مشکلی پیش آمد. لطفا بعدا امتحان کنید.');

    if ((firsName.length <= 25 || firsName.length >= 2) && result.isFirst) await editProfile(result.tokens.accessToken, firsName);
    console.log(result);
    await storeAuthTokens(result.tokens, ctx.from.id);

    ctx.session.step = 'idle';
    ctx.session.data = {};

    ctx.reply('با موفقیت احراز شدید.');
  });
}
