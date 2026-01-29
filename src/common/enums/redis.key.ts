export enum RedisKey {
  AuthSession = 'telegram:session:',
  ForceJoinChannels = 'force_join_channels',
}

export enum RedisExpireTime {
  AuthExpireTime = 30 * 24 * 60 * 60 - 1 * 60 * 60, //* Seconds
}
