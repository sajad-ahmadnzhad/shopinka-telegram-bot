import { forceJoinKeyboard } from "../../modules/force-join/force-join.keyboard";
import { getActiveChannels } from "../../modules/force-join/force-join.service";
import { BotContext } from "../types/context.type";

export const forceJoinMiddleware = async (ctx: BotContext , next: () => Promise<void>) => {
    if(!ctx.from) return next()

    const channels = await getActiveChannels()
    const channelTittle = (await ctx.api.getChat('@testforbotss22')).title
    channels[0] = {channelId: -1003628358308 , isBotAdmin: true , status: "ACTIVE" , username: "testforbotss22" , title: channelTittle}

    if(!channels.length) return next()

    for (const ch of channels) {
        try {
            const member = await ctx.api.getChatMember(ch.channelId , ctx.from.id)

            if(!['left' , 'kicked'].includes(member.status)){
                await ctx.reply('برای استفاده از ربات باید در کانال های زیر عضو باشید.', {reply_markup: forceJoinKeyboard(channels)})
                return
            }
        } catch (error) {
            console.log('check member status error: ' , error)
            continue
        }
    }

    return next()
}