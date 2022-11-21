import { AuthenticatedRequest } from "@/middlewares";
import enrollmentsService from "@/services/enrollments-service";
import ticketsService from "@/services/tickets-service";
import paymentsService from "@/services/payments-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getPaymentInfo(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketId } = req.query as Record<string, string>;

  if(!userId) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  if (!ticketId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const userEnrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
    if(!userEnrollment) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    const userEnrollmentId = userEnrollment.id;

    const searchedTicket = await ticketsService.getTicketByTicketId(Number(ticketId));
    if(!searchedTicket) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    const ticketSearchedEnrollmentId = searchedTicket.enrollmentId;

    if (userEnrollmentId!==ticketSearchedEnrollmentId) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    } 

    const ticketIdSearched = searchedTicket.id;

    if (ticketIdSearched!==Number(ticketId)) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    const paymentInfo = await paymentsService.getPaymentByTicketId(ticketId);

    if (!paymentInfo) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.status(httpStatus.OK).send(paymentInfo);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function postPaymentInfo(req: AuthenticatedRequest, res: Response) {
  return res.send("ok");

  /* const { userId } = req;

  try {
    const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
    const enrollmentId = enrollment.id
    const ticket = await ticketsService.getTicketByEnrollmentId(enrollmentId);
    return res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.send(httpStatus.NOT_FOUND);
    }
  } */
}
