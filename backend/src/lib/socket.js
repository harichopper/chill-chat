// server/socket.js or wherever you configure Socket.IO
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Allow both local and production frontends to connect
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",                     // Local frontend
      "https://chill-chat-9do2.onrender.com",        //  frontend
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store userId to socketId mapping
const userSocketMap = {}; // { userId: socketId }

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`✅ User ${userId} registered with socket ID ${socket.id}`);
  }

  // Broadcast updated list of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);

    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });

  // Notification handler
  socket.on("sendNotification", ({ receiverId, type, message }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveNotification", {
        type,
        message,
      });
      console.log(`📨 Sent ${type} notification to ${receiverId}`);
    }
  });
});

// Export the initialized app and server
export { app, server, io };
