"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../user/user.route");
const payment_route_1 = require("../payment/payment.route");
const auth_route_1 = require("../auth/auth.route");
const post_route_1 = require("../post/post.route");
const meilisearch_route_1 = require("../meilisearch/meilisearch.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/post",
        route: post_route_1.PostRoutes,
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRouter,
    },
    {
        path: "/search-items",
        route: meilisearch_route_1.MeilisearchRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
