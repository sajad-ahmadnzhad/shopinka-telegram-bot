import { Bot } from 'grammy';
import { BotContext } from '../../common/types/context.type';
import { handleCreateAddressFlow } from './flows/create-address.flow';
import { createAddressCallbacks } from './callbacks/create-address.callback';
import { listOfAddressesCallback } from './callbacks/list-of-addresses.callback';
import { removeAddressCallbacks } from './callbacks/remove-address.callback';
import { updateAddressCallbacks } from './callbacks/update-address.callback';
import { handelUpdateAddressFlow } from './flows/update-address.flow';
import { detailsAddressCallbacks } from './callbacks/details-address.callback';
import { toggleDefaultAddressCallbacks } from './callbacks/toggle-default-address.callback';

export function addressHandler(bot: Bot<BotContext>) {
  //* Create address handlers
  handleCreateAddressFlow(bot);
  createAddressCallbacks(bot);

  //* List of addresses handlers
  listOfAddressesCallback(bot);

  //* Remove address handlers
  removeAddressCallbacks(bot);

  //* Update address handlers
  updateAddressCallbacks(bot);
  handelUpdateAddressFlow(bot);

  //* Set default address handlers
  toggleDefaultAddressCallbacks(bot);

  //* Details address handlers
  detailsAddressCallbacks(bot);
}
