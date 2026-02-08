import { InlineKeyboard, Keyboard } from 'grammy';
import { ProductCallbackData } from './enums/product-callback-data.enum';
import { closeInlineKeyboard } from '../../common/keyboards/shared.keyboard';

export const productMenuKeyboard = () => new InlineKeyboard().switchInlineCurrent('لیست محصولات', '#products');

export const productDetailKeyboard = (product: any, isFavorite: boolean) => {
  const inlineKeyboard = new InlineKeyboard()
    .text('ادامه⬅️', `${ProductCallbackData.Continue}${product.id}`)
    .text(
      isFavorite ? '❌حذف از علاقه‌مندی' : '❤️اضافه به علاقه‌مندی',
      isFavorite ? `${ProductCallbackData.RemoveFromFavorite}${product.id}` : `${ProductCallbackData.AddToFavorite}${product.id}`,
    )
    .row()
    .url('🔗آدرس در سایت', `https://shopinka.ir/product/${product.slug}`)
    .text('💬نظرات', `${ProductCallbackData.Comments}${product.id}`)
    .row();

  if (product.galleryImages?.length) inlineKeyboard.text('📸عکس های بیشتر', `${ProductCallbackData.MoreImages}${product.id}`);

  return inlineKeyboard;
};

export const productCommentKeyboard = (productId: number, pager: any) => {
  const keyboard = new InlineKeyboard();

  if (pager.hasPerviousPage) keyboard.text('⬅️ قبلی', `${ProductCallbackData.PreviousComments}${productId}?page=${pager.currentPage - 1}`);

  keyboard.text(`📄 ${pager.currentPage}/${pager.totalPages}`, 'ignore');

  if (pager.hasNextPage) keyboard.text('➡️ بعدی', `${ProductCallbackData.NextComments}${productId}?page=${pager.currentPage + 1}`);

  keyboard.row().add(addProductCommentKeyboard(productId).inline_keyboard[0][0]).add(closeInlineKeyboard().inline_keyboard[0][0]);

  return keyboard;
};

export const addProductCommentKeyboard = (productId: number) =>
  new InlineKeyboard()
    .text('افزودن نظر⤴️', `${ProductCallbackData.AddComment}${productId}`)
    .add(closeInlineKeyboard().inline_keyboard[0][0]);
