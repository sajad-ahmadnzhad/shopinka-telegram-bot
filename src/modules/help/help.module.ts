import { Bot } from 'grammy';
import { BotContext } from '../../common/types/context.type';
import { registerHelpCommand } from './help.command';

export function helpModule(bot: Bot<BotContext>) {
  registerHelpCommand(bot);
}
