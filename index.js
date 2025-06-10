import fs from "fs";
import https from "https";
import http from "http";

import express from "express";
import cors from "cors";
import { Server } from "socket.io";

import errorHandler from "./middleware/errorHandler.js";
import setupSocketHandlers from "./ws.js";
import connectDB from "./db/mongo.js";

const app = express();

await connectDB();

const corsOptions = {
  origin: "*",
  methods: ["GET"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/", (req, res) => {
  res.redirect("https://chat-system.space/");
});

app.use(errorHandler);

const requiredEnv = ["NODE_ENV", "MONGODB_URI", "CLERK_SECRET_KEY"];
for (const variable of requiredEnv) {
  if (!process.env[variable]) {
    console.error(`Missing required environment variable: ${variable}`);
    process.exit(1);
  }
}

if (process.env.NODE_ENV === "dev") {
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, { cors: corsOptions });

  setupSocketHandlers(io);

  httpServer.listen(3001, () => {
    console.log(`HTTP Dev server running at localhost:3001`);
  });
} else {
  const sslOptions = {
    key: fs.readFileSync(
      "/etc/letsencrypt/live/ws.chat-system.space/privkey.pem"
    ),
    cert: fs.readFileSync(
      "/etc/letsencrypt/live/ws.chat-system.space/fullchain.pem"
    ),
  };

  const httpsServer = https.createServer(sslOptions, app);
  const io = new Server(httpsServer, { cors: corsOptions });

  setupSocketHandlers(io);

  httpsServer.listen(443, () => {
    console.log(`HTTPS Prod Server running at ws.chat-system.space`);
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
