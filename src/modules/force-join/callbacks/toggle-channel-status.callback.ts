import { Bot } from 'grammy';
import { BotContext } from '../../../common/types/context.type';
import { ForceJoinCallbackData } from '../enums/force-join-callback-data.enum';
import { activeChannel, getChannel, inActiveChannel } from '../force-join.service';
import { setChannelDetails } from './details-channel.callback';
import { channelDetailMenuKeyboard } from '../force-join.keyboard';

export function toggleChannelStatusCallbacks(bot: Bot<BotContext>) {
  const INACTIVE_CHANNEL_PREFIX = ForceJoinCallbackData.InactiveChannel;

  bot.callbackQuery(new RegExp(`^${INACTIVE_CHANNEL_PREFIX}(-?\\d+)$`), async (ctx) => {
    await ctx.answerCallbackQuery();

    const channelId = Number(ctx.match[1]);

    if (!channelId) return;

    const inactiveChannel = await inActiveChannel(channelId);

    if (typeof inactiveChannel == 'object' && !inactiveChannel.ok) return await ctx.reply(inactiveChannel.message);

    const channel = await getChannel(channelId);

    return await ctx.editMessageText(setChannelDetails(channel.data), {
      reply_markup: channelDetailMenuKeyboard(channel.data.status, channelId),
    });
  });

  const ACTIVE_CHANNEL_PREFIX = ForceJoinCallbackData.ActiveChannel;

  bot.callbackQuery(new RegExp(`^${ACTIVE_CHANNEL_PREFIX}(-?\\d+)$`), async (ctx) => {
    await ctx.answerCallbackQuery();

    const channelId = Number(ctx.match[1]);

    if (!channelId) return;

    const activatedChannel = await activeChannel(channelId);

    if (typeof activatedChannel == 'object' && !activatedChannel.ok) return await ctx.reply(activatedChannel.message);

    const channel = await getChannel(channelId);

    return await ctx.editMessageText(setChannelDetails(channel.data), {
      reply_markup: channelDetailMenuKeyboard(channel.data.status, channelId),
    });
  });
}
