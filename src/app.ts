import cors from "cors";
import express, { Application } from "express";
import router from "./app/modules/routes";
import globalErrorHandler from "./app/modules/middlewares/globalErrorhandler";
import notFound from "./app/modules/middlewares/notFound";
import cookieParser from "cookie-parser";

const app: Application = express();

// Middleware for parsing JSON requests
app.use(express.json());
app.use(cookieParser());

// CORS configuration to allow requests from the frontend
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://wayfarer-world-client.vercel.app", // Development origin
    ],
    credentials: true,
  })
);

// Application routes
app.use("/api", router);

// Global error handler middleware
app.use(globalErrorHandler);

// // Middleware for handling 404 - Not Found
// app.use(notFound);

export default app;
