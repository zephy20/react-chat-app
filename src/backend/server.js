const express = require("express");
var socket = require("socket.io");

const app = express();

server = app.listen("5000", () => {
  console.log("listening on 5000");
});

io = socket(server);
let connectedUsers = [];

io.on("connection", socket => {
  io.emit("userValidated");

  var user = "Anonymous";

  socket.on("newUser", userName => {
    if (userName !== "") user = userName;
    connectedUsers.push(userName);
    socket.broadcast.emit("userValidated", user);
  });
  console.log("connected by:", socket.id);
  socket.on("sendMessage", data => {
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    io.emit("userLeft");
  });
});
