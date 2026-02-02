import { InlineKeyboard } from 'grammy';
import { IForceJoinChannel } from './force-join.interface';
import { ForceJoinCallbackData } from './enums/force-join-callback-data.enum';
import { backInlineKeyboard, closeInlineKeyboard } from '../../common/keyboards/shared.keyboard';
import { ForceJoinChannelStatus } from './enums/force-join-channel-status.enum';

export const forceJoinKeyboard = (channels: IForceJoinChannel[]) => {
  const keyboard = new InlineKeyboard();

  channels.forEach((ch) => {
    if (ch.username) {
      keyboard.url(`عضویت در ${ch.title ?? ch.username}`, `https://t.me/${ch.username}`).row();
    }
  });

  return keyboard;
};

export const forceJoinMenuKeyboard = () => {
  return new InlineKeyboard()
    .text('اضافه کردن کانال', ForceJoinCallbackData.AddChannel)
    .text('دریافت لیست کانال ها', ForceJoinCallbackData.GetChannels)
    .row()
    .add(closeInlineKeyboard().inline_keyboard[0][0]);
};

export const addForceJoinResultKeyboard = ({ retry }: { retry?: boolean } = {}) => {
  const inlineKeyboard = new InlineKeyboard().text('رفتن به لیست کانال ها', ForceJoinCallbackData.GetChannels);

  if (retry) inlineKeyboard.add(retryAddForceJoinChannelKeyboard().inline_keyboard[0][0]).row();

  inlineKeyboard.add(closeInlineKeyboard().inline_keyboard[0][0]);

  return inlineKeyboard;
};

export const channelDetailMenuKeyboard = (channelStatus: ForceJoinChannelStatus, channelId: number) => {
  const inlineKeyboard = new InlineKeyboard().text('🚫حذف', ForceJoinCallbackData.RemoveChannel + channelId);

  if (channelStatus == ForceJoinChannelStatus.ACTIVE)
    inlineKeyboard.text('🔴غیرفعال کردن', ForceJoinCallbackData.InactiveChannel + channelId).row();

  if (channelStatus == ForceJoinChannelStatus.INACTIVE)
    inlineKeyboard.text('🟢فعال کردن', ForceJoinCallbackData.ActiveChannel + channelId).row();

  return inlineKeyboard
    .add(closeInlineKeyboard().inline_keyboard[0][0])
    .add(backInlineKeyboard(ForceJoinCallbackData.GetChannels).inline_keyboard[0][0]);
};

export const addForceJoinChannelKeyboard = () =>
  new InlineKeyboard().text('اضافه کردن کانال', ForceJoinCallbackData.AddChannel).add(closeInlineKeyboard().inline_keyboard[0][0]);

export const retryAddForceJoinChannelKeyboard = () =>
  new InlineKeyboard().text('تلاش دوباره', ForceJoinCallbackData.AddChannel).add(closeInlineKeyboard().inline_keyboard[0][0]);

export const addChannelToForceJoinKeyboard = (channelId: number) =>
  new InlineKeyboard()
    .text('اضافه کردن به عضویت اجباری', ForceJoinCallbackData.AddToList + channelId)
    .add(closeInlineKeyboard().inline_keyboard[0][0]);

export const timeRemainingDeletedChannelKeyboard = (channelId: number) =>
  new InlineKeyboard()
    .text('دیدن زمان باقی مانده', ForceJoinCallbackData.ShowTimeRemaining + channelId)
    .add(closeInlineKeyboard().inline_keyboard[0][0]);
