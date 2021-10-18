import http from 'http';
import Message from './models/message';
import connectToDB from "./db/index.js"; 

const port = process.env.PORT || 3000;
// connectToDB();

const app = require('express')()
app.get('/test', (req, res) => {
  res.send("Node Server is running. Yay!!")
})

const server = http.createServer(app, (req, res) => {
  res.statusCode = 200;
  const msg = 'v1'
  res.end(msg);
});

const io = require('socket.io')(server);

io.on('connection', socket => {
  console.log('a user connected');
  socket.on('newMessage', function (messageBody, userId, channelId) {
    // let newMessage = new Message(
    //   messageBody, userId, channelId
    // )
    socket.emit('messageCreated', { messageBody, userId, channelId })
  })
});
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});