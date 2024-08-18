const http = require('http');
const { Server } = require("socket.io");
const express = require('express');
const app  = express();





const server = http.createServer(app);
 const io = new Server(server, {
  cors: {
      origin: "*", // Replace with your React app URL
      methods: ["GET", "POST"]
  }
});

const userSocketMap={};
const rooms={};
io.on('connection', (socket) => {
  const userId=socket.handshake.query.userId;
  // console.log(socket.handshake.query.userId);
  if(userId!="undefined")userSocketMap[userId]=socket.id;
  console.log('a user connected');

  socket.on('disconnect', () => {
    delete userSocketMap[userId];
      console.log('user disconnected');
  });
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', socket.id);
});

socket.on('offer', (data) => {
    socket.to(data.roomId).emit('offer', data.sdp);
});

socket.on('answer', (data) => {
    socket.to(data.roomId).emit('answer', data.sdp);
});

socket.on('ice-candidate', (data) => {
    socket.to(data.roomId).emit('ice-candidate', data.candidate);
});
  socket.on('message', (message) => {
      // console.log('message received: ', message);
      io.to(userSocketMap[userId]).emit('message',message)
      // io.emit('message', message);
  });
});

const getSocketId=(id)=>{
    return userSocketMap[id];
}





module.exports={io,server,app,getSocketId}