import { Bot } from 'grammy';
import { BotContext } from '../../../common/types/context.type';
import { AddProductCommentStep } from '../enums/product.step';
import { validateStep } from '../../../common/utils/validate-schema.utils';
import { productCommentSchema } from '../product.schema';
import { skipInlineKeyboard, yesNoInlineKeyboard } from '../../../common/keyboards/shared.keyboard';

export function handleAddProductCommentFlow(bot: Bot<BotContext>) {
  bot.on('message:text', async (ctx, next) => {
    const step = ctx.session.step;
    const text = ctx.message.text;

    switch (step) {
      case AddProductCommentStep.Title:
        const title = validateStep(productCommentSchema.title, text, ctx);
        if (!title) return;

        ctx.session.data.title = text;
        ctx.session.step = AddProductCommentStep.Content;
        return await ctx.reply('💬 حالا **متن کامل نظر**تون رو بنویسید:\n(تجربه‌تون از محصول خیلی کمک می‌کنه 🙌)', {
          parse_mode: 'Markdown',
        });

      case AddProductCommentStep.Content:
        const content = validateStep(productCommentSchema.content, text, ctx);
        if (!content) return;

        ctx.session.data.content = text;
        ctx.session.step = AddProductCommentStep.Rate;

        return await ctx.reply(
          '⭐️ به این محصول از **۱ تا ۵** چه امتیازی می‌دید؟\n\n🔹 اگر نظری ندارید، می‌تونید امتیاز پیش‌فرض (۵) رو انتخاب کنید.',
          { parse_mode: 'Markdown', reply_markup: skipInlineKeyboard() },
        );

      case AddProductCommentStep.Rate:
        const rate = validateStep(productCommentSchema.rate, +text, ctx);
        if (!rate) return;

        ctx.session.data.rate = +text;
        ctx.session.step = AddProductCommentStep.IsRecommended;

        return await ctx.reply('🤔 آیا این محصول رو به دیگران **پیشنهاد می‌کنید**؟', {
          parse_mode: 'Markdown',
          reply_markup: yesNoInlineKeyboard(),
        });
      default:
        return await next();
    }
  });
}
