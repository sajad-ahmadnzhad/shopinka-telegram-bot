import { Bot } from 'grammy';
import { BotContext } from '../../../common/types/context.type';
import { ForceJoinCallbackData } from '../enums/force-join-callback-data.enum';
import { buildDeletedBotFromChannelMessage } from '../flows/force-join-chat-member.flow';
import { getChannel } from '../force-join.service';
import { timeRemainingDeletedChannelKeyboard } from '../force-join.keyboard';

export function timeRemainingChannelCallbacks(bot: Bot<BotContext>) {
  const SHOW_TIME_REMAINING_PREFIX: string = ForceJoinCallbackData.ShowTimeRemaining;

  bot.callbackQuery(new RegExp(`^${SHOW_TIME_REMAINING_PREFIX}(-?\\d+)$`), async (ctx) => {
    await ctx.answerCallbackQuery();

    const channelId = Number(ctx.match[1]);

    if (!channelId) return;

    const channel = await getChannel(channelId);

    if (!channel.ok) return await ctx.reply(channel.message);

    const { username, title } = channel.data;

    const chatName = username ? `@${username}` : title;

    const message = buildDeletedBotFromChannelMessage(chatName, channel.data);

    return await ctx.editMessageText(message, { parse_mode: 'Markdown', reply_markup: timeRemainingDeletedChannelKeyboard(channelId) });
  });
}
