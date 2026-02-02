import { forceJoinKeyboard } from '../../modules/force-join/force-join.keyboard';
import { getActiveChannels } from '../../modules/force-join/force-join.service';
import { BotContext } from '../types/context.type';

export const forceJoinMiddleware = async (ctx: BotContext, next: () => Promise<void>) => {
  if (!ctx.from) return next();

  const channels = await getActiveChannels();
  if (!channels.length) return next();

  if (ctx.chat.type == 'channel') return await next();

  for (const ch of channels) {
    try {
      const member = await ctx.api.getChatMember(ch.channelId, ctx.from.id);

      if (['left', 'kicked'].includes(member.status)) {
        await ctx.reply('برای استفاده از ربات باید در کانال های زیر عضو باشید.', { reply_markup: forceJoinKeyboard(channels) });
        return;
      }
    } catch (error) {
      console.log('Check member status error: ', error);
      continue;
    }
  }

  return next();
};
