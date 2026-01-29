import { Bot } from 'grammy';
import { BotContext } from '../../common/types/context.type';
import { registerAuthCommand, registerGetMeCommand, registerSignoutCommand } from './auth.command';
import { authHandler } from './auth.handler';

export function authModule(bot: Bot<BotContext>) {
  registerGetMeCommand(bot);
  registerSignoutCommand(bot);
  registerAuthCommand(bot);
  authHandler(bot);
}
