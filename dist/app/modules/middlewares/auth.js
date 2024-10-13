"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const config_1 = __importDefault(require("../../config"));
// Auth Middleware
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const authorizationHeader = req.headers.authorization;
        // Check if Authorization header exists
        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            return next(new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!"));
        }
        const token = authorizationHeader.split(" ")[1]; // Extract the token
        // Verify the JWT Token
        jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret, (err, decoded) => {
            if (err || !decoded) {
                return next(new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired token!"));
            }
            const user = decoded;
            // Role-based access control (RBAC)
            if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
                return res.status(http_status_1.default.FORBIDDEN).json({
                    success: false,
                    statusCode: http_status_1.default.FORBIDDEN,
                    message: "You do not have access to this route.",
                });
            }
            req.user = user; // Attach decoded user info to the request object
            next();
        });
    }));
};
exports.default = auth;
