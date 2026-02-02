import { InlineKeyboard } from 'grammy';
import { SharedCallbackData } from '../enums/shared-callback-data.enum';

export const yesNoInlineKeyboard = () => new InlineKeyboard().text('بله', SharedCallbackData.Yes).text('خیر', SharedCallbackData.No);

export const closeInlineKeyboard = () => new InlineKeyboard().text('بستن', SharedCallbackData.Close);

export const cancelInlineKeyboard = () => new InlineKeyboard().text('لغو', SharedCallbackData.Cancel);

export const skipInlineKeyboard = () => new InlineKeyboard().text('رد شدن', SharedCallbackData.Skip);

export const backInlineKeyboard = (callbackData: string = SharedCallbackData.Back) => new InlineKeyboard().text('برگشت', callbackData);

export const backToListInlineKeyboard = () => new InlineKeyboard().text('برگشت به لیست', SharedCallbackData.BackToList);
