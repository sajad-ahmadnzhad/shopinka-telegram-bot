export interface IForceJoinChannel {
  channelId: number;
  username: string;
  isBotAdmin: boolean;
  title?: string
  status: 'ACTIVE' | 'PENDING_ADMIN' | 'REMOVED' | 'INACTIVE';
  /**Timestamps*/
  adminLostAt?: number;
}

export interface IServiceResponse {
  ok: boolean
  message?: string
}