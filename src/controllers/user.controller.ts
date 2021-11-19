import mongoose from 'mongoose';
import { Router } from 'express';
import bodyParser from 'body-parser';
import User from '../models/user';
import { userService } from '../services/userService';
import returnSuccess from '../utilities/successHandler';
import authHandler from '../middlewares/authHandler';

export default () => {
  let api = Router();
  console.log('Router');
  // '/v1/user/' - Read
  api.post('/register', (req, res) => {
    console.log('Router/register', req.body);
    let newUser = new User();
    newUser.name = req.body.name;
    newUser.email = req.body.email;
    newUser.password = req.body.password;

    newUser.save(err => {
      if (err) {
        res.status(500).json({ message: err });
      }
      res.status(200).json({ message: 'User register' });
    });
  });

  api.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const userInfo = await userService.login(email, password);
      if (userInfo == null) {
        res.status(200).json({
          success: false,
          message: 'Login fail',
        });
      }
      returnSuccess(200, res, 'Login successfully', userInfo);
    } catch (error) {
      next(error);
    }
  });

  api.use(authHandler);

  api.get('/list', async (req, res, next) => {
    try {
      const { key } = req.query;
      if (!key) {
        const allUsers = await userService.getAllUsers();
        returnSuccess(200, res, 'Got list', allUsers)
      } else {
        console.log(req.query)
        const resultObject = await userService.findUsers(req.query);
        returnSuccess(200, res, 'Got an user list', resultObject);
      }
    } catch (error) {
      next(error);
    }
  });

  api.get('/friends', async (req: any, res, next) => {
    try {
      const { id } = req.user;
      const allFriendIds = await userService.findFriends(id);
      returnSuccess(200, res, 'Got list', allFriendIds)
    } catch (error) {
      next(error);
    }
  });

  api.post('/logout', async (req, res, next) => {
    try {
      var expiredUser = await userService.setExpirationDate(req.body._id);
      returnSuccess(200, res, 'Logged out', null);
    } catch (error) {
      next(error);
    }
  });

  return api;
}