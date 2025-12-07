import e, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "@repo/db";

const app: Express = e();
const allowedOrigins = process.env.CORS_WHITELIST;

app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins?.includes(origin)) {
        return callback(null, origin);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: false,
  })
);
app.use(helmet());

connectDB(String(process.env.MONGO_URI), String(process.env.MONGO_DB_NAME));

import paymentRouter from "./modules/payment/payment.router.js";
import authRouter from "./modules/auth/auth.router.js";

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/auth", authRouter);

export default app;
