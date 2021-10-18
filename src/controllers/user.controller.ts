import mongoose from 'mongoose';
import { Router } from 'express';
import bodyParser from 'body-parser';
import User from '../models/user';

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

    return api;
}