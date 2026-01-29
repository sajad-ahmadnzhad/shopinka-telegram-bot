import { Context } from 'grammy';
import { BotContext } from '../types/context.type';

interface IApiResult {
  status: number;
  message: string;
}

export const validateApiResult = (apiResult: IApiResult, ctx: BotContext | Context) => {};
