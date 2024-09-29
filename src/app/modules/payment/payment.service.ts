import { verifyPament } from "./payment.utils";

const confirmationService = async (tran_id: string, status: string) => {
  const verifyResponse = await verifyPament(tran_id);
  let result;
  let message = "";

  // if (verifyResponse && verifyResponse.pay_status === "Successful") {
  //   result = await Booking.findOneAndUpdate(
  //     { tran_id },
  //     { paymentStatus: "Paid" }
  //   );
  //   message = "Successfully Paid!";
  // } else {
  //   message = "Payment Failed!";
  // }

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
          message === "Successfully Paid!" ? "success-icon" : "failed-icon"
        }">
          ${message === "Successfully Paid!" ? "✔️" : "❌"}
        </div>
        <div class="message">${message}</div>
        <p class="description">
          Thank you for your transaction. You will receive a confirmation email shortly.
        </p>
        <a href="https://car-washing-system-client.vercel.app/" class="btn">Back To Home</a>
      </div>
    </body>
  </html>
  `;

  return template;
};

export const PaymentServices = { confirmationService };
