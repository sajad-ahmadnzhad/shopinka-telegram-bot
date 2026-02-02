import { Bot } from 'grammy';
import { IForceJoinChannel } from './force-join.interface';
import { ADMIN_GREET_TIME, getChannels, removeChannel } from './force-join.service';
import { BotContext } from '../../common/types/context.type';
import { ForceJoinChannelStatus } from './enums/force-join-channel-status.enum';
import { bot } from '../../bot';
import { env } from '../../configs/env.config';

function isPendingExpired(channel: IForceJoinChannel, now: number): boolean {
  if (!channel.adminLostAt) return false;

  return now - channel.adminLostAt >= ADMIN_GREET_TIME;
}

async function handleExpiredPendingChannel(channel: IForceJoinChannel, bot: Bot<BotContext>, adminId: number) {
  await removeChannel(channel.channelId);

  const chatName = channel.username ? `@${channel.username}` : (channel.title ?? '—');

  const message = `
⏰ مهلت بازگردانی ربات به پایان رسید

📣 کانال: ${chatName}
❌ این کانال از لیست «عضویت اجباری» حذف شد.`;

  await bot.api.sendMessage(adminId, message.trim());
}

setInterval(async () => {
  const now = Date.now();
  const channels = await getChannels();

  const pendingChannels = channels.filter((ch) => ch.status === ForceJoinChannelStatus.PENDING_ADMIN);

  const adminId = env.SUPER_ADMIN_CHAT_ID;

  for (const channel of pendingChannels) {
    if (!isPendingExpired(channel, now)) continue;

    await handleExpiredPendingChannel(channel, bot, adminId);
  }
}, 30_000);
