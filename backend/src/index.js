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


app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true, // Enable cookies to be sent along with the request
  })
);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST','PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// app.get("/",(req,res)=>{
//   console.log("server started");
//   res.send("Server is running");
// });

app.use((err, req, res, next) => {
  if (err.name === "CorsError") {
    console.error("CORS Error:", err.message);
    res.status(403).send("CORS error");
  } else {
    next(err);
  }
});


app.get("/", (req, res) => {
  console.log("Root route hit");
  res.send("Hello, welcome to the backend server!");
});

// Static file serving for production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start the server
server.listen(PORT, () => {
  console.log("Server is running on PORT:" + PORT);
  connectDB(); // Connect to MongoDB
});
