import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app as socketApp, server } from "./lib/socket.js";

// Load env vars
dotenv.config();

// Path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use socket.io's Express instance
const app = socketApp;
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: "20mb" }));
app.use(cookieParser());

// CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5001",
      "https://chill-chat-cyan.vercel.app", // Your frontend on Vercel
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Default backend route
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Catch-all for unknown API routes
app.all("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// No need to serve frontend if using Vercel
// If you do want SSR fallback for future use, uncomment below:
/*
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}
*/

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.message);
  res.status(500).json({ error: err.message });
});

// Start server
server.listen(PORT, () => {
  console.log("✅ Server running on port:", PORT);
  connectDB(); // MongoDB connection
});
