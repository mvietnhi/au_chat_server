import express from 'express';
import user from '../controllers/user.controller';
import chat from '../controllers/chat.controller';
import authHandler from '../middlewares/authHandler';

let router = express();

router.use('/user', user());
router.use('/chat', authHandler, chat());

export default router;