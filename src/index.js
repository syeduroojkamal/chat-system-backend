import http from "http";
import https from "https";
import fs from "fs";

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";

import errorHandler from "./middleware/errorHandler.js";
import setupSocketHandlers from "./ws.js";
import connectDB from "./db/mongo.js";

dotenv.config();

const app = express();

await connectDB();

const corsOptions = {
  origin: "*",
  methods: ["GET"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/", (req, res) => {
  res.send("welcome to backend of chat-system.space");
});

app.use(errorHandler);

const requiredEnv = ["NODE_ENV", "MONGODB_URI", "CLERK_SECRET_KEY"];
for (const variable of requiredEnv) {
  if (!process.env[variable]) {
    console.error("Missing required environment variable: ", variable);
    process.exit(1);
  }
}

if (process.env.NODE_ENV === "dev") {
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, { cors: corsOptions });

  setupSocketHandlers(io);

  httpServer.listen(8080, () => {
    console.log("Dev Server is running http://localhost:8080");
  });
} else {
  const sslOptions = {
    key: fs.readFileSync(
      "/etc/letsencrypt/live/api.chat-system.space/privkey.pem"
    ),
    cert: fs.readFileSync(
      "/etc/letsencrypt/live/api.chat-system.space/fullchain.pem"
    ),
  };

  const httpsServer = https.createServer(sslOptions, app);
  const io = new Server(httpsServer, { cors: corsOptions });

  setupSocketHandlers(io);

  httpsServer.listen(443, () => {
    console.log("Prod Server is running at https://api.chat-system.space");
  });
}

// Global error handlers for unhandled promise rejections and uncaught exceptions
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
  process.exit(1);
});
