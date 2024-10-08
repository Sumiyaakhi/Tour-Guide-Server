import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
export const initiatePayment = async (paymentData: any) => {
  try {
    const response = await axios.post(process.env.PAYMENT_URL!, {
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
    const paymentUrl = response.data?.payment_url;

    if (!paymentUrl) {
      throw new Error("Payment URL not found in response");
    }

    return { status: response.status, paymentUrl };
  } catch (error: any) {
    console.error(
      "Payment initiation failed:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Payment initiation failed");
  }
};

export const verifyPament = async (tran_id: string, cus_email: string) => {
  const response = await axios.get(process.env.PAYMENT_VERIFY_URL!, {
    params: {
      store_id: process.env.STORE_ID,
      signature_key: process.env.SIGNATURE_KEY,
      type: "json",
      request_id: tran_id,
    },
  });

  return response.data;
};
