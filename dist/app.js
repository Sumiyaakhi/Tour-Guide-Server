"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./app/modules/routes"));
const globalErrorhandler_1 = __importDefault(require("./app/modules/middlewares/globalErrorhandler"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
// Middleware for parsing JSON requests
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// CORS configuration to allow requests from the frontend
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "https://wayfarer-world-client.vercel.app", // Development origin
    ],
    credentials: true,
}));
// Application routes
app.use("/api", routes_1.default);
// Global error handler middleware
app.use(globalErrorhandler_1.default);
// // Middleware for handling 404 - Not Found
// app.use(notFound);
exports.default = app;
