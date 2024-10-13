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
exports.SearchPostByDateRangeQueryMaker = exports.SearchPostByUserQueryMaker = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const user_constant_1 = require("../user/user.constant");
const user_model_1 = require("../user/user.model");
const SearchPostByUserQueryMaker = (query) => __awaiter(void 0, void 0, void 0, function* () {
    if (query === null || query === void 0 ? void 0 : query.searchTerm) {
        const userQuery = new QueryBuilder_1.default(user_model_1.User.find(), query).search(user_constant_1.UserSearchableFields);
        const users = yield userQuery.modelQuery;
        if (users && users.length > 0) {
            const userIds = users.map((user) => user._id);
            query["user"] = { $in: userIds };
            /**
             * query['user'] = {
             * $in: [
             * ObjectId('5f7b3b3b4f3c7b0b3c7b0b3c'),
             * ObjectId('5f7b3b3b4f3c7b0b3c7b0b3c'),
             * ]
             */
            delete query.searchTerm;
            return query;
        }
    }
    return query;
});
exports.SearchPostByUserQueryMaker = SearchPostByUserQueryMaker;
const SearchPostByDateRangeQueryMaker = (query) => __awaiter(void 0, void 0, void 0, function* () {
    if ((query === null || query === void 0 ? void 0 : query.from) || (query === null || query === void 0 ? void 0 : query.to)) {
        const dateQuery = {};
        if (query.from) {
            dateQuery["$gte"] = new Date(query.from);
        }
        if (query.to) {
            dateQuery["$lte"] = new Date(query.to);
        }
        if (Object.keys(dateQuery).length > 0) {
            query["createdAt"] = dateQuery; // Updated for posts to use 'createdAt' instead of 'dateFound'
        }
        delete query.from;
        delete query.to;
        return query;
    }
    return query;
});
exports.SearchPostByDateRangeQueryMaker = SearchPostByDateRangeQueryMaker;
