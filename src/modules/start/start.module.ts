import { Bot } from 'grammy';
import { BotContext } from '../../common/types/context.type';
import { registerStartCommand } from './start.command';

export function startModule(bot: Bot<BotContext>) {
  registerStartCommand(bot);
}
