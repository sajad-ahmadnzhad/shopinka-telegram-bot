import { Bot } from 'grammy';
import { BotContext } from '../../common/types/context.type';
import { isSuperAdminMiddleware } from '../../common/middlewares/isSuperAdmin.middleware';
import { forceJoinMenuKeyboard } from './force-join.keyboard';

export function registerForeJoinChannelHears(bot: Bot<BotContext>) {
  bot.hears('عضویت اجباری', isSuperAdminMiddleware, (ctx) => {
    ctx.session.step = 'idle';

    return ctx.reply('بخش عضویت اجباری. لطفا گزینه مورد نظر را انتخاب کنید:', { reply_markup: forceJoinMenuKeyboard() });
  });
}
