import { BotContext } from '../types/context.type';
import { redis } from '../../configs/redis.config';
import { IUserAuthTokens } from '../../modules/auth/auth.interface';
import { refreshToken } from '../../api/auth.api';
import { MiddlewareMessage } from '../enums/middleware.message';
import { RedisKey } from '../enums/redis.key';
import { storeAuthTokens } from '../utils/store-auth-tokens.utils';

export const authMiddleware = async (ctx: BotContext, next: () => Promise<void>) => {
  const userId = ctx.from.id;

  const redisKey = `${RedisKey.AuthSession}${userId}`;

  const redisResult = JSON.parse(await redis.get(redisKey)) as IUserAuthTokens;

  if (!redisResult?.accessToken || !redisResult?.refreshToken) return ctx.reply(MiddlewareMessage.AuthForAccess);

  const createdAt = new Date(redisResult.createdAt).getTime();

  if (createdAt + redisResult.accessTokenExpireAt > Date.now()) {
    ctx.session.accessToken = redisResult.accessToken;
    return next();
  }

  const refreshTokenResult = await refreshToken(redisResult.refreshToken);

  if (refreshTokenResult.message?.trim()?.toLowerCase() == 'jwt expired') {
    await redis.del(redisKey);
    return await ctx.reply(MiddlewareMessage.RefreshTokenExpired);
  }

  if (!refreshTokenResult.accessToken) return ctx.reply('مشکلی پیش آمد لطفا بعدا امتحان کنید.');

  const redisData = { refreshToken: redisResult.refreshToken, accessToken: refreshTokenResult.accessToken } as IUserAuthTokens;

  await storeAuthTokens(redisData, ctx.from.id);

  ctx.session.accessToken = redisData.accessToken;

  return await next();
};
