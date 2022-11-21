import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getTickets, getTicketTypes, postCreateOrUpdateTickets } from "@/controllers";
import { ticketValidationSchema } from "@/schemas";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getTicketTypes)
  .get("/", getTickets)
  .post("/", validateBody(ticketValidationSchema), postCreateOrUpdateTickets);

export { ticketsRouter };
