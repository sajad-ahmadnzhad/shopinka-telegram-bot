import { RedisKey } from "../../common/enums/redis.key"
import { redis } from "../../configs/redis.config"
import { IForceJoinChannel, IServiceResponse } from "./force-join.interface"

const ADMIN_GREET_TIME = 10 * 60 * 1000 //* Ten minutes

export const addChannel = async (channel: IForceJoinChannel): Promise<IServiceResponse> => {
    const channels = await getChannels()

    if(channels.some(c => c.channelId === channel.channelId))
        return {ok: false , message: 'کانال قبلا ثبت شده.'}

    channels.push(channel)

    await saveChannel(channels)
    return {ok: true}
}

export const getChannels = async (): Promise<IForceJoinChannel[]> => {
    const data = await redis.get(RedisKey.ForceJoinChannels) 
    return data ? JSON.parse(data) : []
}

export const saveChannel = async (channels: IForceJoinChannel[]): Promise<void> => {
    await redis.set(RedisKey.ForceJoinChannels , JSON.stringify(channels))
}

export const removeChannel = async (channelId: number): Promise<void> => {
    const channels = await getChannels()

    const filtered = channels.filter(c => c.channelId !== channelId)

    await saveChannel(filtered)
}

export const inActiveChannel = async (channelId: number): Promise<void | IServiceResponse> => {
    const channels = await getChannels()

    if(!channels.some(c => c.channelId === channelId)) return {ok: false, message: 'کانال پیدا نشد.'}

    for (const ch of channels) {
        if(ch.channelId === channelId) ch.status = 'INACTIVE'
    }

  await  saveChannel(channels)
}

export const restoreChannel = async (channelId:number): Promise<void> => {
    const channels = await getChannels()

    for (const ch of channels) {
        if(ch.channelId === channelId){
            ch.status = 'ACTIVE'
            delete ch.adminLostAt
        }
    }

    await saveChannel(channels)
}

export const markPendingChannel = async (channelId: number): Promise<void> => {
    const channels = await getChannels()

    for (const ch of channels) {
        if(ch.channelId === channelId) {
            ch.status = 'PENDING_ADMIN'
            ch.adminLostAt = Date.now()
        }
    }

    await saveChannel(channels)
}

export const getActiveChannels = async (): Promise<IForceJoinChannel[]> => {
    const channels = await getChannels()

    return channels.filter(c => {
        if(c.status == 'ACTIVE') return true

        if(c.status == 'PENDING_ADMIN' && c.adminLostAt && Date.now() - c.adminLostAt < ADMIN_GREET_TIME) return false

        return false
    })
}