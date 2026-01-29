import { env } from "../../configs/env.config";
import { BotContext } from "../types/context.type";

export const isSuperAdminMiddleware = (ctx: BotContext , next: () => Promise<void>) => {
    const chatId = ctx.from.id

    if(chatId == env.SUPER_ADMIN_CHAT_ID) return next()
}