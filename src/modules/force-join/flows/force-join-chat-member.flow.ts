import { Bot } from 'grammy';
import { BotContext } from '../../../common/types/context.type';
import { env } from '../../../configs/env.config';
import { ADMIN_GREET_TIME, getChannel, markPendingChannel, restoreChannel } from '../force-join.service';
import { addChannelToForceJoinKeyboard, timeRemainingDeletedChannelKeyboard } from '../force-join.keyboard';
import { msToTime } from '../../../common/utils/functions.utils';
import { ForceJoinChannelStatus } from '../enums/force-join-channel-status.enum';
import { IForceJoinChannel } from '../force-join.interface';

export function buildDeletedBotFromChannelMessage(chatName: string, channel?: IForceJoinChannel) {
  const elapsed = Date.now() - channel?.adminLostAt;
  const remaining = ADMIN_GREET_TIME - elapsed;

  const message = `
🔴 **حذف ربات از کانال**

ربات از کانال **${chatName}** حذف شد ❌
${
  channel
    ? `⏳ کانال **${remaining > 0 ? msToTime(remaining) : '00:00:00'}** فرصت دارد ربات را دوباره به عنوان مدیر اضافه کند.  
در غیر این صورت، این کانال به صورت خودکار از لیست *عضویت اجباری* حذف خواهد شد.`
    : 'ℹ️ این کانال جزو کانال‌های عضویت اجباری ثبت‌شده نیست.'
}`;

  return message;
}

export function handleForceJoinChatMemberFlow(bot: Bot<BotContext>) {
  bot.on('my_chat_member', async (ctx) => {
    const chat = ctx.chat;
    const oldStatus = ctx.myChatMember.old_chat_member.status;
    const newStatus = ctx.myChatMember.new_chat_member.status;

    const chatName = chat.username ? `@${chat.username}` : chat.title;
    const adminId = env.SUPER_ADMIN_CHAT_ID;

    if (oldStatus === 'left' && newStatus === 'administrator') {
      const channel = await getChannel(chat.id);

      if (channel.data && channel.data.status === ForceJoinChannelStatus.PENDING_ADMIN) await restoreChannel(chat.id);

      const message = `
🟢 **ارتقای دسترسی ربات**

ربات در کانال **${chatName}** به عنوان **مدیر** اضافه شد ✅
${
  channel.data
    ? '🔓 این کانال از حالت *در انتظار مدیر* خارج شد و دوباره **فعال** گردید.'
    : 'ℹ️ این کانال هنوز در لیست عضویت اجباری ثبت نشده است.'
}`;
      return ctx.api.sendMessage(adminId, message, {
        parse_mode: 'Markdown',
        reply_markup: !channel.data ? addChannelToForceJoinKeyboard(chat.id) : undefined,
      });
    }

    if (['left', 'kicked'].includes(newStatus)) {
      await markPendingChannel(chat.id);

      const channel = await getChannel(chat.id);

      const message = buildDeletedBotFromChannelMessage(chatName, channel.data);

      return ctx.api.sendMessage(adminId, message, { parse_mode: 'Markdown', reply_markup: timeRemainingDeletedChannelKeyboard(chat.id) });
    }
  });
}
