import e, { Express } from "express";
import cors from "cors";
import helmet from "helmet";

const app: Express = e();

app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_URL,
    credentials: true,
  })
);
app.use(helmet());

app.get("/", (_req, res) => {
  res.status(200).send("Hello from Lumen!");
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/api", (_req, res) => {
  res.status(200).json({ message: "Lumen's API is running and rocking!!!!" });
});

import paymentRouter from "./modules/payment/payment.router.js";

app.use("/api/v1/payments", paymentRouter);

export default app;
