// src/lib/socket.js
import { io } from "socket.io-client";

let socket = null;

// Initialize and connect socket with user ID
export const connectSocket = (userId) => {
  socket = io(
    import.meta.env.MODE === "production"
      ? "https://chill-chat-9do2.onrender.com"
      : "http://localhost:5001",
    {
      transports: ["websocket"],
      withCredentials: true,
      query: { userId },
    }
  );

  return socket;
};

// Retrieve socket instance elsewhere
export const getSocket = () => socket;
