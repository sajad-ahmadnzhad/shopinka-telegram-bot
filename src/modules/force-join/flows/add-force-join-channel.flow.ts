import { Bot } from 'grammy';
import { BotContext } from '../../../common/types/context.type';
import { ForceJoinStep } from '../enums/force-join.step';
import { IForceJoinChannel } from '../force-join.interface';
import { addChannel } from '../force-join.service';
import { addForceJoinResultKeyboard, retryAddForceJoinChannelKeyboard } from '../force-join.keyboard';
import { ForceJoinChannelStatus } from '../enums/force-join-channel-status.enum';

export function handleAddForceJoinChannelFlow(bot: Bot<BotContext>) {
  bot.on('message:text', async (ctx, next) => {
    if (ctx.session.step !== ForceJoinStep.AddChannel) return next();

    const inputText = ctx.message.text.trim();
    const isSingleChannel = !inputText.includes(',');

    const channelUsernames = inputText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    if (channelUsernames.length > 10) return ctx.reply('⚠️ حداکثر می‌توانید در هر درخواست ۱۰ کانال اضافه کنید.');

    for (const username of channelUsernames) {
      if (!username.startsWith('@')) {
        return ctx.reply(`❌ نام کاربری «${username}» نامعتبر است.\nنام کاربری باید با @ شروع شود.`);
      }
    }

    const invalidChannels: string[] = [];
    const adminRequiredChannels: string[] = [];
    const validChannels: IForceJoinChannel[] = [];

    for (const username of channelUsernames) {
      try {
        const chat = await ctx.api.getChat(username);
        const botMember = await ctx.api.getChatMember(chat.id, bot.botInfo.id);

        if (!['administrator', 'creator'].includes(botMember.status) || chat.type !== 'channel') {
          adminRequiredChannels.push(username);
          continue;
        }

        validChannels.push({
          channelId: chat.id,
          username: chat.username!,
          title: chat.title,
          isBotAdmin: true,
          status: ForceJoinChannelStatus.ACTIVE,
        });
      } catch (error) {
        console.error('Force join add channel error:', error);
        invalidChannels.push(username);
      }
    }

    const alreadyAddedChannels: string[] = [];

    const addResults = await Promise.all(validChannels.map((channel) => addChannel(channel)));

    const successfullyAddedChannels: string[] = [];

    addResults.forEach((result, index) => {
      const username = `@${validChannels[index].username}`;

      if (result.ok) successfullyAddedChannels.push(username);
      else alreadyAddedChannels.push(username);
    });

    if (isSingleChannel) {
      ctx.session.step = 'idle';
      ctx.session.data = {};

      if (invalidChannels.length) {
        return ctx.reply('❌ کانال پیدا نشد یا اطلاعات آن معتبر نیست.', { reply_markup: retryAddForceJoinChannelKeyboard() });
      }

      if (adminRequiredChannels.length) {
        return ctx.reply('⚠️ ربات باید در کانال مورد نظر مدیر (Admin) باشد.', { reply_markup: retryAddForceJoinChannelKeyboard() });
      }

      if (alreadyAddedChannels.length) {
        return ctx.reply('ℹ️ این کانال قبلاً در سیستم ثبت شده است.', { reply_markup: retryAddForceJoinChannelKeyboard() });
      }

      return ctx.reply('✅ کانال با موفقیت به لیست عضویت اجباری اضافه شد.', { reply_markup: addForceJoinResultKeyboard() });
    }

    const resultMessage = `
✅ نتیجه عملیات افزودن کانال‌ها

🟢 کانال‌های اضافه‌شده:
${successfullyAddedChannels.length ? successfullyAddedChannels.join(', ') : '—'}

🔁 کانال‌های تکراری:
${alreadyAddedChannels.length ? alreadyAddedChannels.join(', ') : '—'}

⚠️ نیاز به ادمین شدن ربات:
${adminRequiredChannels.length ? adminRequiredChannels.join(', ') : '—'}

❌ کانال‌های نامعتبر:
${invalidChannels.length ? invalidChannels.join(', ') : '—'}

📊 جمع‌بندی:
${successfullyAddedChannels.length ? `${successfullyAddedChannels.length} کانال با موفقیت ثبت شد.✅` : '❌هیچ کانالی به لیست اضافه نشد.'}
`;

    ctx.session.step = 'idle';
    ctx.session.data = {};

    return ctx.reply(resultMessage, { reply_markup: addForceJoinResultKeyboard({ retry: !successfullyAddedChannels.length }) });
  });
}
