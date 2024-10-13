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
exports.deleteDocumentFromIndex = exports.addDocumentToIndex = void 0;
const meilisearch_1 = require("meilisearch");
const config_1 = __importDefault(require("../config"));
const meiliClient = new meilisearch_1.MeiliSearch({
    host: config_1.default.meilisearch_host,
    apiKey: config_1.default.meilisearch_master_key,
});
// console.log(config.meilisearch_master_key);
function addDocumentToIndex(result, indexKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const index = meiliClient.index(indexKey);
        const { _id, title, content, images } = result;
        const firstImage = (images === null || images === void 0 ? void 0 : images[0]) || [];
        const document = {
            id: _id.toString(), // Ensure the ID is a string
            title,
            content,
            thumbnail: firstImage,
        };
        try {
            yield index.addDocuments([document]);
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.error("Error adding document to MeiliSearch:", error);
        }
    });
}
exports.addDocumentToIndex = addDocumentToIndex;
const deleteDocumentFromIndex = (indexKey, id) => __awaiter(void 0, void 0, void 0, function* () {
    const index = meiliClient.index(indexKey);
    try {
        yield index.deleteDocument(id);
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error deleting resource from MeiliSearch:", error);
    }
});
exports.deleteDocumentFromIndex = deleteDocumentFromIndex;
exports.default = meiliClient;
