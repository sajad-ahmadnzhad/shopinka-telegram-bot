import { RedisKey } from '../../common/enums/redis.key';
import { redis } from '../../configs/redis.config';
import { ForceJoinChannelStatus } from './enums/force-join-channel-status.enum';
import { IForceJoinChannel, IServiceResponse } from './force-join.interface';

export const ADMIN_GREET_TIME = 1 * 60 * 60 * 1000; //* one hours

export const addChannel = async (channel: IForceJoinChannel): Promise<IServiceResponse> => {
  const channels = await getChannels();

  if (channels.some((c) => c.channelId === channel.channelId)) return { ok: false, message: 'کانال قبلا ثبت شده.' };

  channels.push(channel);

  await saveChannel(channels);
  return { ok: true };
};

export const getChannel = async (channelId: number): Promise<IServiceResponse<IForceJoinChannel>> => {
  const channels = await getChannels();

  const channel = channels.find((ch) => ch.channelId == channelId);

  if (!channel) return { ok: false, message: 'کانال پیدا نشد.' };

  return { ok: true, data: channel };
};

export const getChannels = async (): Promise<IForceJoinChannel[]> => {
  const data = await redis.get(RedisKey.ForceJoinChannels);
  return data ? JSON.parse(data) : [];
};

export const saveChannel = async (channels: IForceJoinChannel[]): Promise<void> => {
  await redis.set(RedisKey.ForceJoinChannels, JSON.stringify(channels));
};

export const removeChannel = async (channelId: number): Promise<void> => {
  const channels = await getChannels();

  const filtered = channels.filter((c) => c.channelId !== channelId);

  await saveChannel(filtered);
};

export const inActiveChannel = async (channelId: number): Promise<void | IServiceResponse> => {
  const channels = await getChannels();

  if (!channels.some((c) => c.channelId === channelId)) return { ok: false, message: 'کانال پیدا نشد.' };

  for (const ch of channels) {
    if (ch.channelId === channelId) {
      if (ch.status == ForceJoinChannelStatus.PENDING_ADMIN)
        return { ok: false, message: 'فعلا قابلیت غیرفعال کردن این کانال در دسترس نیست' };
      ch.status = ForceJoinChannelStatus.INACTIVE;
    }
  }

  await saveChannel(channels);
};

export const activeChannel = async (channelId: number): Promise<void | IServiceResponse> => {
  const channels = await getChannels();

  if (!channels.some((c) => c.channelId === channelId)) return { ok: false, message: 'کانال پیدا نشد.' };

  for (const ch of channels) {
    if (ch.channelId === channelId) {
      if (ch.status == ForceJoinChannelStatus.PENDING_ADMIN) return { ok: false, message: 'فعلا قابلیت فعال کردن این کانال در دسترس نیست' };
      ch.status = ForceJoinChannelStatus.ACTIVE;
    }
  }

  await saveChannel(channels);
};

export const restoreChannel = async (channelId: number): Promise<void> => {
  const channels = await getChannels();

  for (const ch of channels) {
    if (ch.channelId === channelId) {
      ch.status = ForceJoinChannelStatus.ACTIVE;
      ch.isBotAdmin = true;
      delete ch.adminLostAt;
    }
  }

  await saveChannel(channels);
};

export const markPendingChannel = async (channelId: number): Promise<void> => {
  const channels = await getChannels();

  for (const ch of channels) {
    if (ch.channelId === channelId) {
      ch.status = ForceJoinChannelStatus.PENDING_ADMIN;
      ch.isBotAdmin = false;
      ch.adminLostAt = Date.now();
    }
  }

  await saveChannel(channels);
};

export const getActiveChannels = async (): Promise<IForceJoinChannel[]> => {
  const channels = await getChannels();

  return channels.filter((c) => {
    if (c.status == 'ACTIVE') return true;

    if (c.status == 'PENDING_ADMIN' && c.adminLostAt && Date.now() - c.adminLostAt < ADMIN_GREET_TIME) return false;

    return false;
  });
};
