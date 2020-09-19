const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const Filter = require("bad-words");


const { generateMessage, generateLocationMessage } = require('./utils/messages')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

// messages for events join and leave the chat app
io.on("connection", (socket) => {
  console.log("New Websocket Connection...");


  socket.on('join', ({ username, room }) => {
    socket.join(room)


    socket.emit("message", generateMessage('Welcome!')); // to a single paticular connection
    socket.broadcast.to(room).emit("message", generateMessage(`${username} has joined!`)); // socket.broadcast emits to everyone but this connection

    // socket.emit, io.emit, socket.broadcast
    // io.to.emit, socket.broadcast.to.emit
  })





  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!");
    }
    io.to('Center City').emit("message", generateMessage(message)); // io.emit sends to everyone
    // console.log(message)
    callback();
  });

  socket.on("sendLocation", (coords, callback) => {
    io.emit(
      "locationMessage",
      generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    );
    callback()
    
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("A user has left!"));
  });
});

server.listen(port, () => {
  console.log(`Server is running on ${port}!`);
});