import { Bot } from 'grammy';
import { BotContext } from '../../../common/types/context.type';
import { RedisKey } from '../..//../common/enums/redis.key';
import { authMiddleware } from '../..//../common/middlewares/auth.middleware';
import { redis } from '../..//../configs/redis.config';
import { IUserAuthTokens } from '../auth.interface';
import { signout } from '../..//../api/auth.api';
import { SharedCallbackData } from '../../../common/enums/shared-callback-data.enum';
import { AuthStep } from '../enums/auth.step';

export function signoutCallbacks(bot: Bot<BotContext>) {
  //* No Signout Callback Query
  bot.callbackQuery(SharedCallbackData.No, authMiddleware, (ctx, next) => {
    if (ctx.session.step !== AuthStep.Signout) return next();

    ctx.session.step = 'idle';
    ctx.session.data = {};
    return ctx.editMessageText('عملیات خروج از حساب لغو شد.');
  });

  //* Yes Signout Callback Query
  bot.callbackQuery(SharedCallbackData.Yes, authMiddleware, async (ctx, next) => {
    if (ctx.session.step !== AuthStep.Signout) return next();

    const redisKey = `${RedisKey.AuthSession}${ctx.from.id}`;

    const raw = await redis.get(redisKey);

    const { refreshToken, accessToken } = JSON.parse(raw) as IUserAuthTokens;

    const signoutResult = await signout(refreshToken, accessToken);

    if (!signoutResult.isSuccess) return ctx.reply('مشکلی پیش آمد.');

    await redis.del(redisKey);

    ctx.session.step = 'idle';
    ctx.session.data = {};

    await ctx.editMessageText('با موفقیت از حساب خود خارج شدید.');
  });
}
