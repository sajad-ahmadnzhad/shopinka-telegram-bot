import { InlineKeyboard } from "grammy";
import { IForceJoinChannel } from "./force-join.interface";

export const forceJoinKeyboard = (channels: IForceJoinChannel[]) => {
  const keyboard = new InlineKeyboard();

  channels.forEach(ch => {
    if (ch.username) {
      keyboard.url(`عضویت در ${ch.title ?? ch.username}`, `https://t.me/${ch.username}`).row();
    }
  });

  return keyboard;
};