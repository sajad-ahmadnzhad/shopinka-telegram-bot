import { Bot, session } from 'grammy';
import { BotContext, SessionData } from './common/types/context.type';
import { env } from './configs/env.config';
import { RedisAdapter } from '@grammyjs/storage-redis';
import { redis } from './configs/redis.config';
import { forceJoinMiddleware } from './common/middlewares/force-join.middleware';

export const bot = new Bot<BotContext>(env.BOT_TOKEN);

const sessionStorage = new RedisAdapter({ instance: redis, ttl: 10 * 60 });

bot.use(
  session({
    initial(): SessionData {
      return { data: {}, step: 'idle' };
    },
    storage: sessionStorage,
  }),
);

bot.use(forceJoinMiddleware)