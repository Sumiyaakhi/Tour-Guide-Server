import { Router } from "express";
import { UserRoutes } from "../user/user.route";
import { PaymentRoutes } from "../payment/payment.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: UserRoutes,
  },

  {
    path: "/payment",
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
