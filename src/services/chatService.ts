import { messageRepo } from "../repositories/messageRepo";

export const chatService = {
  async getMessages(
    page: number,
    userId: String,
    toUserId: String,
    limit: number
  ) {
    return await messageRepo.loadMessages(page, userId, toUserId, limit);
  },

  async findMessages(keySearch: String, userId: String, toUserId: String) {
    return await messageRepo
      .findMessages(keySearch, userId, toUserId)
      .then((value) => {
        if (value?.messages) {
          value.messages = value.messages.filter((data) =>
            data.content.includes(keySearch)
          );
        }

        return value;
      });
  },

  async updateMessage(
    messageId: String,
    content: String,
    userId: String,
    toUserId: String
  ) {
    return await messageRepo.updateMessage(
      messageId,
      content,
      userId,
      toUserId
    );
  },

  async hiddenMessage(messageId: String, userId: String, toUserId: String) {
    return await messageRepo.hiddenMessage(messageId, userId, toUserId);
  },
};
