import { Bot } from 'grammy';
import { BotContext } from '../../common/types/context.type';
import { productCommentCallbacks } from './callbacks/product-comments.callback';
import { handleProductInlineQuery } from './product.inline-query';

export function productHandler(bot: Bot<BotContext>) {
  handleProductInlineQuery(bot);
  productCommentCallbacks(bot);
}
