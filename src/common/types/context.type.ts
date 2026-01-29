import { Context } from 'grammy';

export interface SessionData {
  step: 'idle' | string;
  data: any;
  accessToken?: string;
}

export type BotContext = Context & { session: SessionData };
