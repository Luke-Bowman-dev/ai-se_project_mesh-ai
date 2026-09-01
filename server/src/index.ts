import dotenv from 'dotenv';

dotenv.config();

import mongoose from 'mongoose';
import express from "express";
import router from "./routes/index.js";
import { RequestLogger } from "./middleware/logger.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import { logger } from './utils/logger.js';
const app = express(); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static("public"));
app.use(RequestLogger);
app.set('trust proxy', 1);
app.use(router);
app.get("/health", (req, res): void => {
  res.status(200).json({
    "success": true,
    "data": { "status": "ok" },
    "error": null
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    logger.info('MongoDB connected');
    app.listen(port, () => {
      logger.info('Server started', { port: port, env: process.env.NODE_ENV });
    });
  })
  .catch((err) => {
    logger.error(err.message, {stack: err.stack});
    process.exit(1);
  });


