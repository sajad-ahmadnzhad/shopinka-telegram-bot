import { Bot } from 'grammy';
import { BotContext } from '../../../common/types/context.type';
import { SharedCallbackData } from '../../../common/enums/shared-callback-data.enum';
import { AuthStep } from '../enums/auth.step';
import { AuthCallbackData } from '../enums/auth-callback-data.enum';
import { cancelInlineKeyboard } from '../../../common/keyboards/shared.keyboard';

export function getMeCallbacks(bot: Bot<BotContext>) {
  //* Close get me callback
  bot.callbackQuery(SharedCallbackData.Close, async (ctx, next) => {
    if (ctx.session.step !== AuthStep.ShowMyProfile) return next();

    ctx.session.step = 'idle';
    ctx.session.data = {};
    return ctx.editMessageText('با موفقیت بسته شد.');
  });

  //* Change full name callback
  bot.callbackQuery(AuthCallbackData.ChangeFullName, async (ctx) => {
    ctx.session.step = AuthStep.ChangeFullName;

    await ctx.editMessageText('لطفا نام کامل جدید خود را وارد نمایید:', { reply_markup: cancelInlineKeyboard() });
  });

  //* Cancel get me callback
  bot.callbackQuery(SharedCallbackData.Cancel, (ctx, next) => {
    if (ctx.session.step !== AuthStep.ChangeFullName) return next();

    ctx.session.step = 'idle';
    ctx.session.data = {};
    ctx.editMessageText('عملیات تغییر نام لغو شد.\n\nجهت رفتن به پروفایل کاربری دستور /me را وارد کنید.');
  });
}
