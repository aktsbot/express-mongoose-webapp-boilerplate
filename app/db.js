import mongoose from "mongoose";
import config from "./config.js";

import logger from "./logger.js";

export const connectDB = () => {
  // connecting to database
  mongoose.connect(config.mongodb_uri);
  mongoose.connection.on("error", (error) => {
    logger.info("mongodb connection error");
    logger.error(error);
  });
  mongoose.connection.once("open", () => {
    logger.info("mongodb connection success");
  });
  mongoose.connection.on("close", () => {
    logger.info("mongodb connection closed");
  });
};

export const closeDB = () => {
  mongoose.connection.close();
};

export default mongoose;
