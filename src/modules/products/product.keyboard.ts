import { InlineKeyboard } from 'grammy';
import { ProductCallbackData } from './enums/product-callback-data.enum';

export const productMenuKeyboard = () => new InlineKeyboard().text('دیدن محصولات', ProductCallbackData.ShowProducts);
