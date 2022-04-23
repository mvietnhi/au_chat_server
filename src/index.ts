import http from "http";
import Message from "./models/message";
import Room from "./models/room";
import User from "./models/user";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import connectToDB from "./db/index.js";
import routes from "./routes";
import express from "express";
import errorHandler from "./middlewares/errorHandler";
import { messageRepo } from "./repositories/messageRepo";
import message from "./models/message";
import Conversation from "./models/conversation";
const port = process.env.PORT || 3000;
connectToDB();

const app = require("express")();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.server = http.createServer(app);
app.use(routes);
app.get("/", (req, res) => {
  res.json({ message: "Chat API is ALIVE!" });
});
// app.get('/test', (req, res) => {
//   res.send("Node Server is running. Yay!!")
// })

// const server = http.createServer(app, (req, res) => {
//   res.statusCode = 200;
//   const msg = 'v1'
//   res.end(msg);
// });

const users = [];
const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  if (!name || !room) return { error: "Username and room are required." };
  if (existingUser) return { error: "Username is taken." };

  const user = { id, name, room };
  users.push(user);

  return { user };
};

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const io = require("socket.io")(app.server);
io.use(async (socket, next) => {
  try {
    console.log("userid", socket.request._query["userId"]);
    console.log("socket id", socket.id);

    const result = await User.findOneAndUpdate(
      {
        _id: socket.request._query["userId"],
      },
      { socketId: socket.id }
    );
  } catch (error) {
    return error;
  }
  next();
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("newMessage", function (messageBody, userId, channelId) {
    // let newMessage = new Message(
    //   messageBody, userId, channelId
    // )
    socket.emit("messageCreated", { messageBody, userId, channelId });
  });

  socket.on("newRoom", function (name) {
    //Create channel
    let newRoom = new Room({
      _id: new mongoose.Types.ObjectId(),
      name: name,
    });
    console.log("new channel created", newRoom._id);

    newRoom.save(function (err, room) {
      console.log("saved", room, err);
      console.log("new channel created", room._id);
      io.emit("roomCreated", { name: room.name, id: room._id });
    });
  });

  socket.on("sendMessage", async function (data) {
    console.log("sendMessage", data);
    let query = User.findById(data["toUserId"]);
    let userId = data["userId"];

    //save messgage
    await messageRepo.saveMessage(
      data["message"],
      data["userId"],
      data["toUserId"]
    );
    // // find message
    // const chatHistory = await messageRepo.loadMessages(1, data['userId'], data['toUserId'])
    // console.log("loaded mess", chatHistory.messages)
    let user = await query.exec();
    io.to(user.socketId).emit("addMessageResponse", data);
  });

  socket.on("join", ({ name, room }) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    console.log("1111");

    if (error) console.log(error);

    socket.join(user.room);
    socket.emit("messageCreated", {
      user: "admin",
      text: `${user.name}, welcome to room ${user.room}.`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!` });

    // io.sockets.in(data.email).emit('new_msg', { msg: data.message });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });
});

// app.server.listen(port);
// console.log(`Started on port ${app.server.address().port}`);
// app.use(errorHandler);
app.server.listen(port); // hiiiiiiiiiiiiiiiiiiiiiiiiiiiiii fix coflict 2
console.log(`Started on port ${app.server.address().port}`);
app.use(errorHandler);





