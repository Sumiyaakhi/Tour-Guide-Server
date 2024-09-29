import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
export const initiatePayment = async (bookingDetails: any) => {
  try {
    const response = await axios.post(process.env.PAYMENT_URL!, {
      store_id: process.env.STORE_ID,
      signature_key: process.env.SIGNATURE_KEY,
      tran_id: bookingDetails.tran_id,
      success_url: `https://assignment-3-sepia-six.vercel.app/api/payment/confirmation?tran_id=${bookingDetails.tran_id}&status=success`,
      fail_url: `https://assignment-3-sepia-six.vercel.app/api/payment/confirmation?status=failed`,
      cancel_url: "http://localhost:5173/",
      amount: bookingDetails.amount,
      currency: "BDT",
      desc: "Service Booking Payment",
      cus_name: bookingDetails.customer.name,
      cus_email: bookingDetails.customer.email,
      cus_add1: bookingDetails.customer.address,
      cus_city: bookingDetails.customer.city || "Dhaka",
      cus_country: "Bangladesh",
      cus_phone: bookingDetails.customer.phone,
      type: "json",
    });
    const paymentUrl = response.data?.payment_url;

    if (!paymentUrl) {
      throw new Error("Payment URL not found in response");
    }
    console.log(response.data);
    return { status: response.status, paymentUrl };
  } catch (error) {
    console.error("Payment initiation failed:", error);
    throw new Error("Payment initiation failed");
  }
};

export const verifyPament = async (tnxId: string) => {
  const response = await axios.get(process.env.PAYMENT_VERIFY_URL!, {
    params: {
      store_id: process.env.STORE_ID,
      signature_key: process.env.SIGNATURE_KEY,
      type: "json",
      request_id: tnxId,
    },
  });

  return response.data;
};
