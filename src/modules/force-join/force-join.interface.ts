import { ForceJoinChannelStatus } from './enums/force-join-channel-status.enum';

export interface IForceJoinChannel {
  channelId: number;
  username: string;
  isBotAdmin: boolean;
  title?: string;
  status: ForceJoinChannelStatus;
  /**Timestamps*/
  adminLostAt?: number;
}

export interface IServiceResponse<T = any> {
  ok: boolean;
  message?: string;
  data?: T;
}
