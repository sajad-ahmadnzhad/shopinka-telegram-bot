import { Bot } from 'grammy';
import { BotContext } from '../../../common/types/context.type';
import { ForceJoinCallbackData } from '../enums/force-join-callback-data.enum';
import { ForceJoinStep } from '../enums/force-join.step';
import { cancelInlineKeyboard } from '../../../common/keyboards/shared.keyboard';
import { SharedCallbackData } from '../../../common/enums/shared-callback-data.enum';
import { addChannel } from '../force-join.service';
import { IForceJoinChannel } from '../force-join.interface';
import { ForceJoinChannelStatus } from '../enums/force-join-channel-status.enum';

export function addChannelCallbacks(bot: Bot<BotContext>) {
  bot.callbackQuery(ForceJoinCallbackData.AddChannel, async (ctx) => {
    await ctx.answerCallbackQuery();

    ctx.session.step = ForceJoinStep.AddChannel;

    const message = `🔑لطفا نام کاربری کانال را وارد نمایید.\n
❕نکته:‌ اگر میخواهید چندین کانال را اضافه کنید نام کاربری کانال ها را با , از هم جدا کنید.
مثال:\n@test_channel1,@test_channel2,@test_channel3`;

    return await ctx.editMessageText(message, { reply_markup: cancelInlineKeyboard() });
  });

  bot.callbackQuery(SharedCallbackData.Cancel, async (ctx, next) => {
    if (ctx.session.step !== ForceJoinStep.AddChannel) return await next();

    ctx.session.step = 'idle';
    ctx.session.data = {};

    return await ctx.editMessageText('با موفقیت لغو شد.');
  });

  const ADD_TO_LIST_PREFIX: string = ForceJoinCallbackData.AddToList;

  bot.callbackQuery(new RegExp(`^${ADD_TO_LIST_PREFIX}(-?\\d+)$`), async (ctx) => {
    const channelId: number = Number(ctx.match[1]);

    await ctx.answerCallbackQuery();

    if (!channelId) return;

    try {
      const chat = await ctx.api.getChat(channelId);
      const botMember = await ctx.api.getChatMember(chat.id, bot.botInfo.id);

      if (!['administrator', 'creator'].includes(botMember.status) || chat.type !== 'channel') {
        return await ctx.editMessageText('مشکلی پیش آمد. ربات در کانال به مقام مدیر ارتقا نیافته است.');
      }

      const channelInfo: IForceJoinChannel = {
        channelId,
        isBotAdmin: true,
        status: ForceJoinChannelStatus.ACTIVE,
        username: chat.username,
        title: chat.title,
      };

      await addChannel(channelInfo);

      return await ctx.editMessageText(`کانال ${chat.username ? `@${chat.username}` : chat.title} با موفقیت به عضویت اجباری اضافه شد.`);
    } catch (error) {
      console.log('Add channel error:', error);
      await ctx.reply('مشکلی در افزودن این کانال پیش آمد. لطفا از صحت نام کاربری کانال اطمینان حاصل کنید.');
    }
  });
}
