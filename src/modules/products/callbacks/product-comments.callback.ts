import { Bot } from 'grammy';
import { BotContext } from '../../../common/types/context.type';
import { ProductCallbackData } from '../enums/product-callback-data.enum';
import { getComments } from '../../../api/comment.api';
import { sanitizeTelegramText, truncateText } from '../../../common/utils/functions.utils';
import { addProductCommentKeyboard, productCommentKeyboard } from '../product.keyboard';

export function productCommentCallbacks(bot: Bot<BotContext>) {
  const COMMENTS_PREFIX = ProductCallbackData.Comments;
  const PREVIOUS_COMMENT_PREFIX: string = ProductCallbackData.PreviousComments;
  const NEXT_COMMENT_PREFIX: string = ProductCallbackData.NextComments;

  const commentTrigger = [
    new RegExp(`^${COMMENTS_PREFIX}(\\d+)$`),
    new RegExp(`^${PREVIOUS_COMMENT_PREFIX}(\\d+)\\?page=(\\d+)$`),
    new RegExp(`^${NEXT_COMMENT_PREFIX}(\\d+)\\?page=(\\d+)$`),
  ];

  bot.callbackQuery(commentTrigger, async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.api.sendChatAction(ctx.from.id, 'typing');

    const productId = Number(ctx.match[1]);
    const page = ctx.match?.[2] ? Number(ctx.match[2]) : 1;

    if (!productId) return;

    const { isSuccess, message, data } = await getComments({ productId: productId.toString(), includeUser: 'true', page: page.toString() });

    if (!isSuccess) return ctx.reply(message);

    const comments = data.items;

    if (!comments.length) {
      return ctx.reply('🗨️ هنوز نظری برای این محصول ثبت نشده است.', { reply_markup: addProductCommentKeyboard(productId) });
    }

    let text = ` 🗨️ *نظرات کاربران*\n\n`;

    for (const comment of comments) {
      text += `
👤 *${comment.user.fullName ?? 'کاربر ناشناس'}*
⭐️ امتیاز: ${comment.rate}/5
${comment.isRecommended ? '👍 پیشنهاد می‌کنم' : '👎 پیشنهاد نمی‌کنم'}

💬 ${truncateText(sanitizeTelegramText(comment.title), 50)}
📝 ${truncateText(sanitizeTelegramText(comment.content), 250)}
\n──────────────`;
    }

    if (!data.pager.hasNextPage) text += `\n✅ تمام نظرات نمایش داده شدند.`;

    text = text.slice(0, 3900);

    const keyboard = productCommentKeyboard(productId, data.pager);

    return ctx.reply(text, { parse_mode: 'Markdown', reply_markup: keyboard });
  });
}
