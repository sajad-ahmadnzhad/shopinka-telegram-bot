import { InlineKeyboard } from 'grammy';
import { AddressMenuCallbackData } from './enums/address-callback-data.enum';
import { closeInlineKeyboard } from '../../common/keyboards/shared.keyboard';

export const addressMenuKeyboard = () =>
  new InlineKeyboard()
    .text('➕ ساخت آدرس جدید', AddressMenuCallbackData.CreateNew)
    .text('📋 لیست آدرس‌ها', AddressMenuCallbackData.List)
    .row()
    .text('بستن', AddressMenuCallbackData.CloseMainMenu);

export const skipUnitKeyboard = () => new InlineKeyboard().text('رد شدن', AddressMenuCallbackData.SkipUnit);

export const useProfileFullNameKeyboard = () =>
  new InlineKeyboard().text('استفاده از نام پروفایل کاربری', AddressMenuCallbackData.UseProfileFullName).row();

export const addressDetailMenuKeyboard = (addressId: number, isDefault: boolean) =>
  new InlineKeyboard()
    .text('حذف', AddressMenuCallbackData.Remove + addressId)
    .text('ویرایش', AddressMenuCallbackData.Update + addressId)
    .row()
    .text(
      isDefault ? 'حذف از پیشفرض' : 'تنظیم پیشفرض',
      isDefault ? AddressMenuCallbackData.UnsetDefault + addressId : AddressMenuCallbackData.SetDefault + addressId,
    )
    .text('برگشت', AddressMenuCallbackData.List);

export const backToAddressList = () => new InlineKeyboard().text('برگشت به لیست', AddressMenuCallbackData.List);

export const createNewAddressKeyboard = () =>
  new InlineKeyboard().text('ساخت آدرس جدید', AddressMenuCallbackData.CreateNew).add(closeInlineKeyboard().inline_keyboard[0][0]);

export const updateAddressKeyboard = (addressId: number) =>
  new InlineKeyboard()
    .text('نام کامل', AddressMenuCallbackData.UpdateFullName)
    .text('استان', AddressMenuCallbackData.UpdateProvince)
    .text('شهر', AddressMenuCallbackData.UpdateCity)
    .row()
    .text('شماره ساختمان', AddressMenuCallbackData.UpdateBuildingNumber)
    .text('کد پستی', AddressMenuCallbackData.UpdatePostalCode)
    .text('آدرس پستی', AddressMenuCallbackData.UpdatePostalAddress)
    .row()
    .text('واحد', AddressMenuCallbackData.UpdateUnit)
    .text('برگشت', AddressMenuCallbackData.ShowDetails + addressId)
    .row();

export const cancelUpdateAddressKeyboard = () => new InlineKeyboard().text('❌لغو', AddressMenuCallbackData.CancelUpdate).row();
