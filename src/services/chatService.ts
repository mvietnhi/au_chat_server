import { messageRepo } from '../repositories/messageRepo';

export const chatService = {
    async getMessages(page: number, userId: String, toUserId: String, limit: number) {
        return await messageRepo.loadMessages(page, userId, toUserId, limit)
    },
}