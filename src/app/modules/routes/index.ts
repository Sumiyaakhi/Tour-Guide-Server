import { Router } from "express";
import { UserRoutes } from "../user/user.route";
import { PaymentRoutes } from "../payment/payment.route";
import { AuthRouter } from "../auth/auth.route";
import { PostRoutes } from "../post/post.route";
import { MeilisearchRoutes } from "../meilisearch/meilisearch.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: UserRoutes,
  },

  {
    path: "/post",
    route: PostRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/search-items",
    route: MeilisearchRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
