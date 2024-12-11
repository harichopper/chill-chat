import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? "https://chill-chat-9do2.onrender.com" : "http://localhost:5173",
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}
function sendMessageToUser(receiverId, message) {
  const socketId = userSocketMap[receiverId];
  if (socketId) {
    io.to(socketId).emit("message", message);
  }
}


io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
const socket = io("http://localhost:5001", {
  query: {
    token: localStorage.getItem("token"), // or however you store the token
  },
});

socket.on("getOnlineUsers", (userIds) => {
  console.log("Online users:", userIds);
});

socket.on("newMessage", (message) => {
  console.log("New message:", message);
});


export { io, app, server };
