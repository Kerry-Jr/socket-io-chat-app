const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

// messages for events join and leave the chat app
io.on("connection", (socket) => {
  console.log("New Websocket Connection...");

  socket.emit("message", "Welcome!"); // to a single paticular connection
  socket.broadcast.emit("message", "A new user has joined the chat!"); // socket.broadcast emits to everyone but this connection

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!");
    }
    io.emit("message", message); // io.emit sends to everyone
    // console.log(message)
    callback();
  });

  socket.on("sendLocation", (coords, callback) => {
    io.emit(
      "message",
      `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
    );
    callback()
    
  });

  socket.on("disconnect", (message) => {
    io.emit("message", "A user has left!");
  });
});

server.listen(port, () => {
  console.log(`Server is running on ${port}!`);
});