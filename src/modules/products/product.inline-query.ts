import { Bot } from 'grammy';
import { BotContext } from '../../common/types/context.type';
import { getOneProduct, getProducts } from '../../api/product.api';
import { InlineQueryResult } from 'grammy/types';
import { sanitizeTelegramText, truncateText } from '../../common/utils/functions.utils';
import { productDetailKeyboard } from './product.keyboard';

export function handleProductInlineQuery(bot: Bot<BotContext>) {
  bot.on('inline_query', async (ctx) => {
    let query = ctx.inlineQuery.query?.trim() ?? '';
    const offset = Number(ctx.inlineQuery.offset || 1);

    if (query === '#products') query = '';

    const { isSuccess, data, message } = await getProducts({ search: query, includeMainImage: 'true', page: offset.toString() });

    if (!isSuccess) {
      return ctx.answerInlineQuery(
        [{ type: 'article', id: 'error', title: '⚠️ خطا', input_message_content: { message_text: `❌ ${message}` } }],
        { cache_time: 0 },
      );
    }

    if (!data.items.length) {
      return ctx.answerInlineQuery(
        [
          {
            type: 'article',
            id: 'empty',
            title: '😕 محصولی پیدا نشد',
            description: 'عبارت جستجو رو تغییر بده',
            input_message_content: {
              message_text: '🔎 محصولی مطابق جستجوی شما پیدا نشد.',
            },
          },
        ],
        { cache_time: 0 },
      );
    }

    const results: InlineQueryResult[] = data.items
      .filter((item) => item.mainImage?.fileUrl)
      .map((item) => ({
        type: 'article',
        id: `product:${item.id}`,
        title: item.name,
        description: item.mainImage?.description?.slice(0, 60),
        thumbnail_url: item.mainImage!.fileUrl,
        input_message_content: {
          message_text: `🛍 ${item.name}`,
        },
      }));

    return ctx.answerInlineQuery(results, { next_offset: `${offset + 1}`, cache_time: 0 });
  });

  bot.on('chosen_inline_result', async (ctx) => {
    const resultId = ctx.chosenInlineResult.result_id;

    if (!resultId.startsWith('product:')) return;

    const productId = Number(resultId.split(':')[1]);
    if (!productId) return;

    await ctx.api.sendChatAction(ctx.from.id, 'typing');

    const { data: product, isSuccess, message } = await getOneProduct(productId);

    if (!isSuccess) return await ctx.api.sendMessage(ctx.from.id, message);

    let caption = `
🛍 **${product.name}**

📦 موجودی: ${product.quantity ?? '—'} عدد
💰 قیمت پایه: ${product.basePrice.toLocaleString()} تومان
🧾 نوع محصول: ${product.type === 'VARIABLE' ? 'متغیر' : 'ساده'}

📐 ابعاد:
▪️ طول: ${product.length ?? '—'} سانتی متر
▪️ عرض: ${product.width ?? '—'} سانتی متر
▪️ ارتفاع: ${product.height ?? '—'} سانتی متر
▪️ وزن: ${product.weight ?? '—'} گرم
    `.trim();

    if (product.tags.length) {
      caption += `

🏷 **تگ‌ها:**
${product.tags
  .slice(0, 5)
  .map((t) => `#${t.name.replaceAll(' ', '_')}`)
  .join('  ')}
`;
    }

    if (product.shortDescription) {
      caption += `
📝 **توضیح کوتاه:**
${truncateText(sanitizeTelegramText(product.shortDescription), 300)}
`;
    }

    caption = caption.slice(0, 1024);

    //TODO: Check for product favorite for user
    const keyboard = productDetailKeyboard(product, false);

    try {
      return await ctx.api.sendPhoto(ctx.from.id, product.mainImage.fileUrl, { caption, reply_markup: keyboard, parse_mode: 'Markdown' });
    } catch {
      return ctx.api.sendMessage(ctx.from.id, caption, { reply_markup: keyboard, parse_mode: 'Markdown' });
    }
  });
}
