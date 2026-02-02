import { Bot } from 'grammy';
import { BotContext } from '../../common/types/context.type';
import { registerForeJoinChannelHears } from './force-join.hears';
import { forceJoinHandler } from './force-join.handler';

export function forceJoinModule(bot: Bot<BotContext>) {
  registerForeJoinChannelHears(bot);
  forceJoinHandler(bot);
}
