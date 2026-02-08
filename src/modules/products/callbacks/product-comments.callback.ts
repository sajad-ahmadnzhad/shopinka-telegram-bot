import { Bot } from 'grammy';
import { BotContext } from '../../../common/types/context.type';
import { ProductCallbackData } from '../enums/product-callback-data.enum';
import { getComments, postComment } from '../../../api/comment.api';
import { sanitizeTelegramText, truncateText } from '../../../common/utils/functions.utils';
import { addProductCommentKeyboard, productCommentKeyboard } from '../product.keyboard';
import { AddProductCommentStep } from '../enums/product.step';
import { SharedCallbackData } from '../../../common/enums/shared-callback-data.enum';
import { authMiddleware } from '../../../common/middlewares/auth.middleware';
import { cancelNormalKeyboard, yesNoInlineKeyboard } from '../../../common/keyboards/shared.keyboard';

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

  const ADD_COMMENT_PREFIX: string = ProductCallbackData.AddComment;

  bot.callbackQuery(new RegExp(`^${ADD_COMMENT_PREFIX}(\\d+)$`), async (ctx) => {
    await ctx.answerCallbackQuery();

    const productId = Number(ctx.match[1]);

    if (!productId) return;

    ctx.session.data = { productId };
    ctx.session.step = AddProductCommentStep.Title;

    return await ctx.reply('📝 لطفاً **عنوان نظر** خودتون رو وارد کنید:', { parse_mode: 'Markdown', reply_markup: cancelNormalKeyboard() });
  });

  bot.callbackQuery([SharedCallbackData.Yes, SharedCallbackData.No], authMiddleware, async (ctx, next) => {
    if (ctx.session.step !== AddProductCommentStep.IsRecommended) return await next();

    const callbackQuery = ctx.callbackQuery.data;

    if (callbackQuery == SharedCallbackData.No) ctx.session.data.isRecommended = false;
    else ctx.session.data.isRecommended = true;

    const { isSuccess, message } = await postComment(ctx.session.accessToken, ctx.session.data);

    ctx.session.step = 'idle';
    ctx.session.data = {};

    if (!isSuccess) return await ctx.reply(message);

    return await ctx.reply(
      '✅ **نظر شما با موفقیت ثبت شد!** 🙏\n\n🕒 پس از بررسی و تأیید مدیران، نظر شما در صفحه محصول نمایش داده می‌شود.',
      {
        reply_markup: { remove_keyboard: true },
        parse_mode: 'Markdown',
      },
    );
  });

  bot.callbackQuery(SharedCallbackData.Skip, async (ctx, next) => {
    if (ctx.session.step !== AddProductCommentStep.Rate) return await next();

    ctx.session.data.rate = 5;
    ctx.session.step = AddProductCommentStep.IsRecommended;

    return await ctx.editMessageText('⭐️ امتیاز **۵ (پیش‌فرض)** برای این محصول ثبت شد.\n\n🤔 آیا این محصول رو به دیگران پیشنهاد می‌کنید؟', {
      reply_markup: yesNoInlineKeyboard(),
      parse_mode: 'Markdown',
    });
  });
}
