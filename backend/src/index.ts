// src/index.ts
import "reflect-metadata";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source.js";
import { createServer } from "./server.js";
import { logger } from "./utils/logger.js";

dotenv.config();

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Database initialization
    await AppDataSource.initialize();
    logger.info("Database connection established");

    // Server start
    const app = createServer();
    app.listen(port, () => {
      logger.info(`Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    logger.error("Initialization failed", err);
    process.exit(1);
  }
};

startServer();
