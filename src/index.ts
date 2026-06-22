import dotenv from 'dotenv';

dotenv.config();

import mongoose from 'mongoose';
import express from "express";
import router from "./routes/index.js";
import { logger } from "./middleware/logger.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
const app = express(); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static("public"));
app.use(logger);
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
mongoose.connect(process.env.MONGO_URI!)
.then(() => {
  console.log('MongoDB connected');
  app.listen(port, () => { 
  console.info(`Server running on port ${port}`); 
});
}) 
.catch((err) => {
  console.error('Connection error', err);
});

