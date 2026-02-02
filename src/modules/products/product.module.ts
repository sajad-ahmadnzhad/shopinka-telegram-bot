import { Bot } from 'grammy';
import { BotContext } from '../../common/types/context.type';
import { registerProductCommand } from './product.command';

export function productModule(bot: Bot<BotContext>) {
  registerProductCommand(bot);
}
