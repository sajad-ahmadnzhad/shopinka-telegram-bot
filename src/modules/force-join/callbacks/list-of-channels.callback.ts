import { Bot, InlineKeyboard } from 'grammy';
import { BotContext } from '../../../common/types/context.type';
import { ForceJoinCallbackData } from '../enums/force-join-callback-data.enum';
import { getChannels } from '../force-join.service';
import { closeInlineKeyboard } from '../../../common/keyboards/shared.keyboard';
import { addForceJoinChannelKeyboard } from '../force-join.keyboard';

export function listOfChannelsCallbacks(bot: Bot<BotContext>) {
  bot.callbackQuery(ForceJoinCallbackData.GetChannels, async (ctx) => {
    await ctx.answerCallbackQuery();

    const keyboard = new InlineKeyboard();

    const channels = await getChannels();

    for (let i = 0; i < channels.length; i += 2) {
      const first = channels[i];
      const second = channels[i + 1];

      keyboard.text(first.title ?? first.username, ForceJoinCallbackData.ShowChannelDetails + first.channelId);

      if (second) keyboard.text(second.title ?? second.username, ForceJoinCallbackData.ShowChannelDetails + second.channelId);

      keyboard.row();
    }

    keyboard.add(closeInlineKeyboard().inline_keyboard[0][0]);

    if (!channels.length) return await ctx.editMessageText('هنوز کانالی اضافه نشده است.', { reply_markup: addForceJoinChannelKeyboard() });

    return await ctx.editMessageText('لیست کانال های عضویت اجباری:', { reply_markup: keyboard });
  });
}
