import http from 'http';
import Message from './models/message';
import dotenv from 'dotenv';
dotenv.config();
import connectToDB from "./db/index.js";
import routes from './routes';
import express from 'express';

const port = process.env.PORT || 3000;
connectToDB();

const app = require('express')();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.server = http.createServer(app);
app.use(routes);
app.get('/', (req, res) => {
  res.json({ message: 'Chat API is ALIVE!' })
});
// app.get('/test', (req, res) => {
//   res.send("Node Server is running. Yay!!")
// })

// const server = http.createServer(app, (req, res) => {
//   res.statusCode = 200;
//   const msg = 'v1'
//   res.end(msg);
// });

const io = require('socket.io')(app.server);

io.on('connection', socket => {
  console.log('a user connected');
  socket.on('newMessage', function (messageBody, userId, channelId) {
    // let newMessage = new Message(
    //   messageBody, userId, channelId
    // )
    socket.emit('messageCreated', { messageBody, userId, channelId })
  })
});
app.server.listen(port);
console.log(`Started on port ${app.server.address().port}`);
