export interface IUserAuthTokens {
  accessToken: string;
  refreshToken: string;
  /**Number of milliseconds*/
  accessTokenExpireAt: number;
  createdAt: Date;
}
