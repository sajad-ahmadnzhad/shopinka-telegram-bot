import { InlineKeyboard, Keyboard } from 'grammy';
import { AuthCallbackData } from './enums/auth-callback-data.enum';
import { closeInlineKeyboard } from '../../common/keyboards/shared.keyboard';

export const requestContactKeyboard = () => new Keyboard().requestContact('📱 ارسال شماره').resized().oneTime();

export const changeFullNameKeyboard = () =>
  new InlineKeyboard().text('تغییر نام', AuthCallbackData.ChangeFullName).add(closeInlineKeyboard().inline_keyboard[0][0]);
