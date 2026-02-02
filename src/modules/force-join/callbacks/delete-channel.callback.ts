import { Bot } from 'grammy';
import { BotContext } from '../../../common/types/context.type';
import { ForceJoinCallbackData } from '../enums/force-join-callback-data.enum';
import { removeChannel } from '../force-join.service';
import { yesNoInlineKeyboard } from '../../../common/keyboards/shared.keyboard';
import { SharedCallbackData } from '../../../common/enums/shared-callback-data.enum';
import { ForceJoinStep } from '../enums/force-join.step';

export function deleteChannelCallbacks(bot: Bot<BotContext>) {
  const REMOVE_CHANNEL_PREFIX: string = ForceJoinCallbackData.RemoveChannel;

  bot.callbackQuery(new RegExp(`^${REMOVE_CHANNEL_PREFIX}(-?\\d+)$`), async (ctx) => {
    ctx.session.data = { channelId: ctx.match[1] };
    ctx.session.step = ForceJoinStep.RemoveChannel;
    return await ctx.editMessageText(`آیا از حذف این کانال اطمینان دارید؟`, { reply_markup: yesNoInlineKeyboard() });
  });

  bot.callbackQuery([SharedCallbackData.Yes, SharedCallbackData.No], async (ctx, next) => {
    const callbackQuery = ctx.callbackQuery.data;

    if (ctx.session.step !== ForceJoinStep.RemoveChannel) return await next();

    if (callbackQuery == SharedCallbackData.No) return await ctx.editMessageText('عملیات حذف کانال لغو شد.');

    const channelId = Number(ctx.session.data.channelId);

    if (!channelId) return;

    await removeChannel(channelId);

    return await ctx.editMessageText('کانال با موفقیت حذف شد.');
  });
}
