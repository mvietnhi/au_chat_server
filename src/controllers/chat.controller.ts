import mongoose from "mongoose";
import { Router } from "express";
import { chatService } from "../services/chatService";
import returnSuccess from "../utilities/successHandler";
import { INIT_PAGE, LIMIT_PER_PAGE } from "../utilities/shared/constants";

export default () => {
  let api = Router();

  api.get("/messages", async (req, res, next) => {
    try {
      const {
        page = INIT_PAGE,
        userId,
        toUserId,
        limit = LIMIT_PER_PAGE,
      } = req.query;

      const allMessages = await chatService.getMessages(
        Number(page),
        userId as String,
        toUserId as String,
        Number(limit)
      );

      returnSuccess(200, res, "Got list", allMessages);
    } catch (error) {
      next(error);
    }
  });

  api.get("/search", async (req, res, next) => {
    try {
      const { keySearch, userId, toUserId, limit = LIMIT_PER_PAGE } = req.query;

      const allMessages = await chatService.findMessages(
        keySearch as String,
        userId as String,
        toUserId as String
      );

      returnSuccess(200, res, "Got list", allMessages);
    } catch (error) {
      next(error);
    }
  });

  api.put("/update/:messageId", async (req, res, next) => {
    try {
      const messageId = req.params.messageId;
      const { content, userId, toUserId } = req.body;

      await chatService.updateMessage(messageId, content, userId, toUserId);

      returnSuccess(200, res, "Updated success", []);
    } catch (error) {
      next(error);
    }
  });

  api.put("/hidden/:messageId", async (req, res, next) => {
    try {
      const messageId = req.params.messageId;
      const { userId, toUserId } = req.body;

      await chatService.hiddenMessage(messageId, userId, toUserId);

      returnSuccess(200, res, "Updated success (hidden)", null);
    } catch (error) {
      next(error);
    }
  });

  return api;
};
