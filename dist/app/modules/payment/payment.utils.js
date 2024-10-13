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
exports.verifyPament = exports.initiatePayment = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const initiatePayment = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield axios_1.default.post(process.env.PAYMENT_URL, {
            store_id: process.env.STORE_ID,
            signature_key: process.env.SIGNATURE_KEY,
            tran_id: paymentData.tran_id,
            success_url: `http://localhost:5000/api/payment/confirmation?tran_id=${paymentData.tran_id}&status=success`,
            fail_url: `http://localhost:5000/api/payment/confirmation?status=failed`,
            cancel_url: "http://localhost:5000/",
            amount: paymentData.price,
            currency: "BDT",
            desc: "User verification Payment",
            cus_name: paymentData.userName,
            cus_email: paymentData.userEmail,
            cus_add1: paymentData.userAddress,
            cus_city: "Dhaka",
            cus_country: "Bangladesh",
            cus_phone: paymentData.userPhone,
            type: "json",
        });
        console.log("Response data:", response.data); // Log full response
        const paymentUrl = (_a = response.data) === null || _a === void 0 ? void 0 : _a.payment_url;
        if (!paymentUrl) {
            throw new Error("Payment URL not found in response");
        }
        return { status: response.status, paymentUrl };
    }
    catch (error) {
        console.error("Payment initiation failed:", error.response ? error.response.data : error.message);
        throw new Error("Payment initiation failed");
    }
});
exports.initiatePayment = initiatePayment;
const verifyPament = (tran_id, cus_email) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(process.env.PAYMENT_VERIFY_URL, {
        params: {
            store_id: process.env.STORE_ID,
            signature_key: process.env.SIGNATURE_KEY,
            type: "json",
            request_id: tran_id,
        },
    });
    return response.data;
});
exports.verifyPament = verifyPament;
