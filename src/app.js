import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/api-error.js";

const app = express();
app.use(cookieParser());

app.use(express.json({ limit: "16mb" }));
app.use(express.urlencoded({ limit: "16mb", extended: true }));
app.use(express.static("public"));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

import healthcheckRoutes from "./routes/healthcheck.routes.js";
app.use("/api/v1/healthcheck", healthcheckRoutes);

import authRouter from "./routes/auth.routes.js";
app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

import projectRouter from "./routes/project.routes.js";
app.use("/api/v1/projects", projectRouter);

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      data: null,
      message: err.message,
      success: false,
      errors: err.errors,
    });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({
    statusCode: 500,
    data: null,
    message: err.message || "Internal Server Error",
    success: false,
  });
});

export default app;
