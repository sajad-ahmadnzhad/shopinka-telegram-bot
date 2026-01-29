import { Bot } from 'grammy';
import { BotContext } from '../../common/types/context.type';
import { getMeCallbacks } from './callbacks/get-me.callback';
import { signoutCallbacks } from './callbacks/signout.callback';
import { handleChangeNameFlow } from './flows/change-name.flow';
import { handleGetContactFlow } from './flows/get-contact.flow';
import { handleGetPhone } from './flows/get-phone.flow';
import { handleAuthFlow } from './flows/auth.flow';

export function authHandler(bot: Bot<BotContext>) {
  //* Get me handlers
  getMeCallbacks(bot);
  handleChangeNameFlow(bot);

  //* Signout handlers
  signoutCallbacks(bot);

  //* Get contact handlers
  handleGetContactFlow(bot);

  //* Get phone handlers
  handleGetPhone(bot);

  //* Auth handlers
  handleAuthFlow(bot);
}
