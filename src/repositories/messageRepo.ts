import Message from '../models/message';
import Conversation from '../models/conversation';

export const messageRepo = {

    async saveMessage(message: String, userId: String, toUserId: String) {
        let channelId = getChannelId(userId, toUserId)
        let messageObjects = [{ content: message, userId, toUserId }]
        return await Conversation.findOneAndUpdate({ channelId: channelId }, { $push: { messages: messageObjects } }, { upsert: true })
    },

    async loadMessages(page: number, userId: String, toUserId: String, limit: number = 10): Promise<any> {
        let channelId = getChannelId(userId, toUserId)
        let slice = [{ $reverseArray: "$messages" }, Math.max(page - 1, 0) * limit, limit];
        let reverseMessages = await Conversation.findOne({ channelId: channelId }, { messages: { $slice: slice } }).exec()
        return reverseMessages
    }
}

const getChannelId = (userId: String, toUserId: String) => {
    return userId < toUserId ? (`${userId}-${toUserId}`) : (`${toUserId}-${userId}`)
}