import { Bot } from 'grammy';
import { BotContext } from '../../common/types/context.type';
import { handleAddForceJoinChannelFlow } from './flows/add-force-join-channel.flow';
import { addChannelCallbacks } from './callbacks/add-channel.callback';
import { listOfChannelsCallbacks } from './callbacks/list-of-channels.callback';
import { detailsChannelCallbacks } from './callbacks/details-channel.callback';
import { toggleChannelStatusCallbacks } from './callbacks/toggle-channel-status.callback';
import { deleteChannelCallbacks } from './callbacks/delete-channel.callback';
import { handleForceJoinChatMemberFlow } from './flows/force-join-chat-member.flow';
import { timeRemainingChannelCallbacks } from './callbacks/time-remaining-channel.callback';

export function forceJoinHandler(bot: Bot<BotContext>) {
  addChannelCallbacks(bot);
  handleAddForceJoinChannelFlow(bot);

  listOfChannelsCallbacks(bot);
  detailsChannelCallbacks(bot);
  toggleChannelStatusCallbacks(bot);
  deleteChannelCallbacks(bot);
  timeRemainingChannelCallbacks(bot);

  handleForceJoinChatMemberFlow(bot);
}
