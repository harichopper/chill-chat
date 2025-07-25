import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// ✅ Allow multiple frontends for socket.io CORS
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chill-chat-r4pg.vercel.app",
      "https://chill-chat-9do2.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// ✅ Online user mapping
const userSocketMap = {}; // { userId: socketId }

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// ✅ Socket connection
io.on("connection", (socket) => {
  console.log("🔌 A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // Broadcast updated online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
