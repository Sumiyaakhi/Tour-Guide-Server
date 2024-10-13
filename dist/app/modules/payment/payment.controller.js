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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("./payment.service");
const confirmationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tran_id, pay_status, cus_email } = req.query;
    console.log(req.query.tran_id);
    const result = yield payment_service_1.PaymentServices.confirmationService(tran_id, pay_status, cus_email);
    res.send(result);
});
exports.PaymentController = {
    confirmationController,
};
