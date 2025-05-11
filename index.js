import express from "express";
import fs from "fs";
import https from "https";

import homeRoutes from "./routes/home.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(express.json()); // for JSON body parsing
app.use(logger); // custom logger
app.use("/", homeRoutes); // routes
app.use(errorHandler); // error handler

// SSL certificate paths (from certbot)
const sslOptions = {
  key: fs.readFileSync(
    "/etc/letsencrypt/live/ws.chat-system.space/privkey.pem"
  ),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/ws.chat-system.space/fullchain.pem"
  ),
};

https.createServer(sslOptions, app).listen(443, () => {
  console.log(`🔐 HTTPS Server running at https://ws.chat-system.space`);
});
