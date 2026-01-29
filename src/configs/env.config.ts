import 'dotenv/config';

export const env = {
  BOT_TOKEN: process.env.BOT_TOKEN as string,
  REDIS_PORT: Number(process.env.REDIS_PORT) as number,
  REDIS_HOST: process.env.REDIS_HOST as string,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD as undefined | string,
  BACKEND_BASE_URL: process.env.BACKEND_BASE_URL as string,
  SUPER_ADMIN_CHAT_ID: Number(process.env.SUPER_ADMIN_CHAT_ID) as number,
  NODE_ENV: process.env.NODE_ENV as string,
};

if (!env.BOT_TOKEN) throw new Error('BOT_TOKEN is not defined.');
if (!env.REDIS_HOST) throw new Error('REDIS_HOST is not defined.');
if (!env.REDIS_PORT) throw new Error('REDIS_PORT is not defined.');
if (!env.BACKEND_BASE_URL) throw new Error('BACKEND_BASE_URL is not defined.');
if (!['prod', 'dev'].includes(env.NODE_ENV)) throw new Error("NODE_ENV is required. and should be ['dev' | 'prod'] value.");
if (!env.SUPER_ADMIN_CHAT_ID || Number.isNaN(env.SUPER_ADMIN_CHAT_ID)) throw new Error('SUPER_ADMIN_CHAT_ID is required.');
