import mongoose from 'mongoose';
import { Router } from 'express';
import { chatService } from '../services/chatService';
import returnSuccess from '../utilities/successHandler';

export default () => {
    let api = Router();

    api.get('/messages', async (req, res, next) => {
        try {
            const { page, userId, toUserId, limit } = req.query;
            const allMessages = await chatService.getMessages(Number(page), userId as String, toUserId as String, Number(limit))
            returnSuccess(200, res, 'Got list', allMessages)
        } catch (error) {
            next(error);
        }
    });

    return api;
}