import { Bot } from 'grammy';
import { BotContext } from '../../common/types/context.type';
import { registerAddressCommand, registerCancelAddressCommand } from './address.command';
import { addressHandler } from './address.handler';

export function addressModule(bot: Bot<BotContext>) {
  registerAddressCommand(bot);
  registerCancelAddressCommand(bot);
  addressHandler(bot);
}
