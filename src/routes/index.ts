import express from 'express';
import user from '../controllers/user.controller';

let router = express();

router.use('/user', user());

export default router;