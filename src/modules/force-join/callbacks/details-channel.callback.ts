import { Bot } from 'grammy';
import { BotContext } from '../../../common/types/context.type';
import { ForceJoinCallbackData } from '../enums/force-join-callback-data.enum';
import { ADMIN_GREET_TIME, getChannel } from '../force-join.service';
import { channelDetailMenuKeyboard } from '../force-join.keyboard';
import { msToTime } from '../../../common/utils/functions.utils';
import { IForceJoinChannel } from '../force-join.interface';
import { SharedCallbackData } from '../../../common/enums/shared-callback-data.enum';

export function setChannelDetails(channel: IForceJoinChannel) {
  const { channelId, adminLostAt, isBotAdmin, title, username, status } = channel;

  const elapsed = Date.now() - adminLostAt;
  const remaining = ADMIN_GREET_TIME - elapsed;

  const timeRemainingMessage = adminLostAt ? `⏳ زمان باقی‌مانده تا حذف کانال: ${remaining > 0 ? msToTime(remaining) : '00:00:00'}` : '';

  const channelStatus = status === 'ACTIVE' ? '✅ فعال' : status === 'INACTIVE' ? '❌ غیرفعال' : '⚠️ در انتظار مدیر';

  const botRole = isBotAdmin ? '🤖 ربات: مدیر' : '🤖 ربات: کاربر';

  const message = `
🔑 شناسه کانال: ${channelId}\n
📢 عنوان کانال: ${title ?? '--'}\n
📲 نام کاربری کانال: @${username ?? '—'}\n
${botRole}\n
📌 وضعیت کانال: ${channelStatus}
${timeRemainingMessage ? `\n${timeRemainingMessage}` : ''}
`;

  return message;
}

export function detailsChannelCallbacks(bot: Bot<BotContext>) {
  const SHOW_DETAILS_PREFIX: string = ForceJoinCallbackData.ShowChannelDetails;

  bot.callbackQuery(new RegExp(`^${SHOW_DETAILS_PREFIX}(-?\\d+)$`), async (ctx) => {
    const channelId = Number(ctx.match[1]);

    if (!channelId) return;

    const channel = await getChannel(channelId);

    if (!channel.ok) return await ctx.reply(channel.message);

    const message = setChannelDetails(channel.data);

    return await ctx.editMessageText(message, { reply_markup: channelDetailMenuKeyboard(channel.data.status, channelId) });
  });

  bot.callbackQuery(SharedCallbackData.Close, async (ctx) => {
    await ctx.editMessageText('با موفقیت بسته شد.');
  });
}
