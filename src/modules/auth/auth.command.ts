import { Bot } from 'grammy';
import { BotContext } from '../../common/types/context.type';
import { redis } from '../../configs/redis.config';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import { getMe } from '../../api/user.api';
import { changeFullNameKeyboard, requestContactKeyboard } from './auth.keyboard';
import { AuthStep } from './enums/auth.step';
import { RedisKey } from '../../common/enums/redis.key';
import { RoleMap } from './enums/role.map';
import { yesNoInlineKeyboard } from '../../common/keyboards/shared.keyboard';

export function registerAuthCommand(bot: Bot<BotContext>) {
  bot.command('auth', async (ctx) => {
    const userId = ctx.from.id;

    ctx.session.step = AuthStep.RequestContact;
    ctx.session.data = {};

    if (await isAuthenticateUser(userId)) return ctx.reply('شما از قبل احراز هستید.');

    ctx.reply('👋 خوش اومدی!\nبرای ادامه شماره موبایلت رو ارسال کن', { reply_markup: requestContactKeyboard() });
  });
}

export function registerSignoutCommand(bot: Bot<BotContext>) {
  bot.command('signout', authMiddleware, async (ctx) => {
    ctx.session.step = AuthStep.Signout;

    ctx.reply('این دستور باعث می شود از حساب کاربری خود خارج شوید. آیا از این کار اطمینان دارید؟', { reply_markup: yesNoInlineKeyboard() });
  });
}

export function registerGetMeCommand(bot: Bot<BotContext>) {
  bot.command('me', authMiddleware, async (ctx) => {
    const { data: user, isSuccess } = await getMe(ctx.session.accessToken);

    if (!isSuccess) return ctx.reply('مشکلی پیش آمد. لطفا بعدا امتحان کنید.');

    ctx.session.step = AuthStep.ShowMyProfile;

    return ctx.reply(
      `
👤 پروفایل کاربری

📛 نام کامل: ${user.fullName ?? 'ثبت نشده'}
📱 موبایل: ${user.mobile}
🎭 نقش: ${RoleMap[user.role]}
`.trim(),
      { reply_markup: changeFullNameKeyboard() },
    );
  });
}

async function isAuthenticateUser(userId: number) {
  const result = await redis.get(`${RedisKey.AuthSession}${userId}`);

  return !!result;
}
