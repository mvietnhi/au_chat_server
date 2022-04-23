// import Message from '../models/message';
import Conversation from "../models/conversation";
import User from "../models/user";
import Message from "../models/new_message";

export const messageRepo = {
  async saveMessage(message: String, userId: String, toUserId: String) {
    let channelId = getChannelId(userId, toUserId);
    let messageObjects = [{ content: message, userId, toUserId }];
    // let createTestMassage = await Message.create({
    //   content: message,
    //   userId,
    //   toUserId,
    // });

    let conversation = await Conversation.findOneAndUpdate(
      { channelId: channelId },
      { $push: { messages: messageObjects } },
      { upsert: true }
    );

    await User.findByIdAndUpdate(userId, {
      $addToSet: { friendIds: toUserId },
    });
    await User.findByIdAndUpdate(toUserId, {
      $addToSet: { friendIds: userId },
    });

    return conversation;
  },

  async loadMessages(
    page: number,
    userId: String,
    toUserId: String,
    limit: number
  ): Promise<any> {
    let channelId = getChannelId(userId, toUserId);
    let slice = [
      { $reverseArray: "$messages" },
      Math.max(page - 1, 0) * limit,
      limit,
    ];

    let reverseMessages = await Conversation.findOne(
      { channelId: channelId },
      { messages: { $slice: slice } }
    )
      .populate({
        path: "messages",
        populate: [
          {
            path: "userId",
            model: "User",
            select: ["name", "email"],
          },
          {
            path: "toUserId",
            model: "User",
            select: ["name", "email"],
          },
        ],
      })
      .exec();

    return reverseMessages;
  },

  async findMessages(
    keySearch: String,
    userId: String,
    toUserId: String,
    limit: number = 10
  ): Promise<any> {
    let channelId = getChannelId(userId, toUserId);

    return await Conversation.findOne({ channelId: channelId })
      // .explain()
      .populate({
        path: "messages",
        populate: [
          {
            path: "userId",
            model: "User",
            select: ["name", "email"],
          },
          {
            path: "toUserId",
            model: "User",
            select: ["name", "email"],
          },
        ],
      })
      .exec();
  },

  async updateMessage(
    messageId: String,
    content: String,
    userId: String,
    toUserId: String
  ) {
    let channelId = getChannelId(userId, toUserId);

    return await Conversation.findOneAndUpdate(
      {
        channelId: channelId,
        "messages._id": messageId,
      },
      {
        $set: {
          "messages.$.content": content,
        },
      }
    ).exec();
  },

  async hiddenMessage(messageId: String, userId: String, toUserId: String) {
    let channelId = getChannelId(userId, toUserId);

    return await Conversation.findOneAndUpdate(
      {
        channelId: channelId,
        "messages._id": messageId,
      },
      {
        $set: {
          "messages.$.is_hidden": true,
        },
      }
    ).exec();
  },
};

const getChannelId = (userId: String, toUserId: String) => {
  return userId < toUserId ? `${userId}-${toUserId}` : `${toUserId}-${userId}`;
};
