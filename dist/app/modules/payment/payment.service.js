"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentServices = void 0;
const user_model_1 = require("../user/user.model");
const payment_utils_1 = require("./payment.utils");
const confirmationService = (cus_email, tran_id, pay_status) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const verifyResponse = yield (0, payment_utils_1.verifyPament)(
      cus_email,
      tran_id
    );
    console.log("sdfghasfgi", verifyResponse);
    let message = "User verification failed."; // Default message
    const email = verifyResponse.cus_email;
    if (verifyResponse && verifyResponse.pay_status === "Successful") {
      // Find user by email
      console.log(`Looking for user with email: ${email}`);
      const user = yield user_model_1.User.findOne({ email: email });
      if (user) {
        user.verified = true; // Set the user as verified
        yield user.save();
        message = "User Verified successfully!";
      } else {
        message = "User not found."; // Log if the user is not found
        console.error(`No user found with email: ${email}`);
      }
    }
    const template = `
    <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Payment Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #f5f5f5;
        }
        .container {
          text-align: center;
          background-color: #ffffff;
          padding: 50px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .icon {
          font-size: 50px;
          margin-bottom: 20px;
        }
        .success-icon {
          color: #28a745;
        }
        .failed-icon {
          color: #dc3545;
        }
        .message {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .description {
          font-size: 16px;
          color: #666;
        }
        .btn {
          padding: 10px 20px;
          background-color: #14a0d1;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }
        .btn:hover {
          background-color: #117c9f;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .btn:active {
          background-color: #0e6781;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon ${
          message === "User Verified successfully!"
            ? "success-icon"
            : "failed-icon"
        }">
          ${message === "User Verified successfully!" ? "✔️" : "❌"}
        </div>
        <div class="message">${message}</div>
        <p class="description">
          Thank you for your transaction. You will receive a confirmation email shortly.
        </p>
        <a href="https://wayfarer-world-client.vercel.app/profile" class="btn">Back To Profile?</a>
      </div>
    </body>
  </html>
  `;
    return template;
  });
exports.PaymentServices = { confirmationService };
