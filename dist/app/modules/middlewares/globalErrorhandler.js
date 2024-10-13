"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const config_1 = __importDefault(require("../../config"));
const handleZodError_1 = __importDefault(require("../../error/handleZodError"));
const handleValidationError_1 = __importDefault(require("../../error/handleValidationError"));
const handleCastError_1 = __importDefault(require("../../error/handleCastError"));
const handleDuplicateError_1 = __importDefault(require("../../error/handleDuplicateError"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const globalErrorHandler = (err, req, res, next) => {
    // Setting default values
    let statusCode = 500;
    let message = "Something went wrong!";
    let errorSources = [
        {
            path: "",
            message: "Something went wrong",
        },
    ];
    // Handle different error types
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err.name === "ValidationError") {
        const simplifiedError = (0, handleValidationError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err.name === "CastError") {
        const simplifiedError = (0, handleCastError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err.code === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
        errorSources = [{ path: "", message: err.message }];
    }
    else if (err instanceof Error) {
        message = err.message;
        errorSources = [{ path: "", message: err.message }];
    }
    // Log the error for debugging
    console.error(err);
    // Ultimate return
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: config_1.default.NODE_ENV === "development" ? err : undefined, // Return error details only in development
        stack: config_1.default.NODE_ENV === "development" ? err.stack : null,
    });
    // Return void
    return;
};
exports.default = globalErrorHandler;
