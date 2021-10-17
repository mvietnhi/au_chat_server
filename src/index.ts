import http from 'http';
import Message from './models/message';
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  const msg = 'Hello Node123!\n'
  res.end(msg);
});

const io = require('socket.io')(server);

io.on('connection', socket => {
  console.log('a user connected');
  socket.on('newMessage', function (messageBody, userId, channelId) {
    let newMessage = new Message(
      messageBody, userId, channelId
    )
    socket.emit('messageCreated', newMessage.messageBody, newMessage.userId, newMessage.channelId)
  })
});
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});