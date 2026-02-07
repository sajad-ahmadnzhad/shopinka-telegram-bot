import { Bot } from 'grammy';
import { BotContext } from '../../common/types/context.type';
import { registerProductCommand } from './product.command';
import { productHandler } from './product.handler';

export function productModule(bot: Bot<BotContext>) {
  registerProductCommand(bot);

  productHandler(bot);
}
