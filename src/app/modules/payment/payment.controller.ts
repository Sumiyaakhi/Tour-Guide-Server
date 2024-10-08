import { Request, Response } from "express";
import { PaymentServices } from "./payment.service";

const confirmationController = async (req: Request, res: Response) => {
  const { tran_id, pay_status, cus_email } = req.query;
  console.log(req.query.tran_id);
  const result = await PaymentServices.confirmationService(
    tran_id as string,
    pay_status as string,
    cus_email as string
  );
  res.send(result);
};

export const PaymentController = {
  confirmationController,
};
