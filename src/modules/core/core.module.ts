import { Bot } from 'grammy';
import { BotContext } from '../../common/types/context.type';
import { startModule } from '../start/start.module';
import { helpModule } from '../help/help.module';
import { authModule } from '../auth/auth.module';
import { addressModule } from '../address/address.module';
import { forceJoinModule } from '../force-join/force-join.module';

export function coreModule(bot: Bot<BotContext>) {
  startModule(bot);
  helpModule(bot);
  authModule(bot);
  addressModule(bot);
  forceJoinModule(bot);
}
