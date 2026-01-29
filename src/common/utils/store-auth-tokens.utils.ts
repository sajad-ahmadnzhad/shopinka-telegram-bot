import { IUserAuthTokens } from '../../modules/auth/auth.interface';
import { RedisExpireTime, RedisKey } from '../enums/redis.key';
import { redis } from '../../configs/redis.config';

export async function storeAuthTokens(tokens: IUserAuthTokens, telegramId: number): Promise<void> {
  const key = `${RedisKey.AuthSession}${telegramId}`;

  if (!tokens.accessTokenExpireAt) tokens.accessTokenExpireAt = 23 * 60 * 60 * 1000;
  if (!tokens.createdAt) tokens.createdAt = new Date();

  await redis.set(key, JSON.stringify(tokens), 'EX', RedisExpireTime.AuthExpireTime);
}
