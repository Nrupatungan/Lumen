import { Router } from "express";
import { createOrders, verifyPayments } from "./payment.controller.js";

const router: Router = Router();

router.post("/create-order", createOrders);
router.post("/verify-payment", verifyPayments);

export default router;
