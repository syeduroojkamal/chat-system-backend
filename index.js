import express from "express";
import dotenv from "dotenv";
import homeRoutes from "./routes/home.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // for JSON body parsing
app.use(logger); // custom logger
app.use("/", homeRoutes); // routes
app.use(errorHandler); // error handler

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
