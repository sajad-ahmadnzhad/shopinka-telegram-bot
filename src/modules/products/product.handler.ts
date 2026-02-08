import { Bot } from 'grammy';
import { BotContext } from '../../common/types/context.type';
import { productCommentCallbacks } from './callbacks/product-comments.callback';
import { handleProductInlineQuery } from './product.inline-query';
import { handleAddProductCommentFlow } from './flows/add-product-comment.flow';
import { handleProductHears } from './product.hears';

export function productHandler(bot: Bot<BotContext>) {
  handleProductHears(bot);
  handleProductInlineQuery(bot);
  productCommentCallbacks(bot);
  handleAddProductCommentFlow(bot);
}
