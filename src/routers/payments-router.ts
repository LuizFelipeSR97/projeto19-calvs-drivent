import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { paymentValidationSchema } from "@/schemas";
import { getPaymentInfo, postPaymentInfo } from "@/controllers";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", getPaymentInfo)
  .post("/process", validateBody(paymentValidationSchema),  postPaymentInfo);

export { paymentsRouter };
