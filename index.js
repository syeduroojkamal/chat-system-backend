import express from "express";
import fs from "fs";
import https from "https";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import mongoose from "mongoose";

import homeRoutes from "./routes/home.js";
import userRoutes from "./routes/user.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Connect mongoose to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log("✅ Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err);
});

app.use(cors());
app.use(express.json()); // for JSON body parsing
app.use(logger); // custom logger
app.use("/", homeRoutes); // routes
app.use("/user", userRoutes); // user routes
app.use(errorHandler); // error handler

if (process.env.NODE_ENV === "dev") {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET"],
    },
  });

  io.on("connection", (socket) => {
    console.log("on | connection id = ", socket.id);

    socket.broadcast.emit("alert", socket.id);
    console.log("emit | socket.id = ", socket.id);

    socket.on("client-server-message", (message) => {
      io.emit("server-client-message", message);
    });

    socket.on("disconnect", () => {
      console.log("on | disconnect id = ", socket.id);
    });
  });

  server.listen(3001, () => {
    console.log(`🌐 Dev server running at http://localhost:3001`);
  });
} else {
  // SSL certificate paths (from certbot)
  const sslOptions = {
    key: fs.readFileSync(
      "/etc/letsencrypt/live/ws.chat-system.space/privkey.pem"
    ),
    cert: fs.readFileSync(
      "/etc/letsencrypt/live/ws.chat-system.space/fullchain.pem"
    ),
  };

  const httpsServer = https.createServer(sslOptions, app);
  const io = new Server(httpsServer, {
    cors: {
      origin: "*",
      methods: ["GET"],
    },
  });

  io.on("connection", (socket) => {
    console.log("on | connection id = ", socket.id);

    socket.broadcast.emit("alert", socket.id);
    console.log("emit | socket.id = ", socket.id);

    socket.on("client-server-message", (message) => {
      io.emit("server-client-message", message);
    });

    socket.on("disconnect", () => {
      console.log("on | disconnect id = ", socket.id);
    });
  });

  httpsServer.listen(443, () => {
    console.log(`🔐 HTTPS Server running at https://ws.chat-system.space`);
  });
}

// Global error handlers for unhandled promise rejections and uncaught exceptions
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Recommended: send to error tracking service, then exit
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
  // Recommended: send to error tracking service, then exit
  process.exit(1);
});
