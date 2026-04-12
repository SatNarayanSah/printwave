// src/config/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "printwave",
    synchronize: process.env.NODE_ENV !== "production", // Auto-sync schema in dev
    logging: process.env.NODE_ENV === "false–",
    entities: [process.env.NODE_ENV === "production" ? "dist/entities/**/*.js" : "src/entities/**/*.ts"],
    migrations: [process.env.NODE_ENV === "production" ? "dist/migrations/**/*.js" : "src/migrations/**/*.ts"],
    subscribers: [process.env.NODE_ENV === "production" ? "dist/subscribers/**/*.js" : "src/subscribers/**/*.ts"],
});
