import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// ✅ Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://chill-chat-9do2.onrender.com"
];

// ✅ CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"]
  })
);

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Global error handler
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    console.error("CORS Error:", err.message);
    return res.status(403).json({ error: "CORS error: Access denied" });
  }
  next(err);
});

// ✅ Root test route
app.get("/", (req, res) => {
  res.redirect("/login");
});

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// ✅ Start server
server.listen(PORT, () => {
  console.log(`✅ Server is running on PORT: ${PORT}`);
  connectDB(); // Connect to MongoDB
});
