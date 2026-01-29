import { Bot } from 'grammy';
import { BotContext } from '../../../common/types/context.type';
import { AuthStep } from '../enums/auth.step';
import { editProfile } from '../../../api/user.api';
import { validateStep } from '../../../common/utils/validate-schema.utils';
import { fullNameSchema } from '../auth.schema';

export function handleChangeNameFlow(bot: Bot<BotContext>) {
  bot.on('message:text', async (ctx, next) => {
    const session = ctx.session;
    const text = ctx.message.text;

    if (session.step !== AuthStep.ChangeFullName) return await next();

    const validFullName = validateStep(fullNameSchema, text, ctx);

    if (!validFullName) return;

    const result = await editProfile(session.accessToken, text);

    if (!result.isSuccess) return ctx.reply('مشکلی پیش آمده لطفا بعدا امتحان کنید.');

    ctx.session.step = 'idle';
    ctx.session.data = {};

    return ctx.reply(`نام شما با موفقیت به "${text}" تغییر یافت.\n\nدستور /me جهت مشاهده اطلاعات پروفایل.`);
  });
}
