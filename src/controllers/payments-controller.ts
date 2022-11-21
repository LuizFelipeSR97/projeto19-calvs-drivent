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
  const { userId } = req;
  const paymentInfo = req.body;

  try {
    const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
    if(!enrollment) return res.sendStatus(httpStatus.NOT_FOUND);
    const enrollmentId = enrollment.id;

    const userTicket = await ticketsService.getTicketByEnrollmentId(enrollmentId);
    if (!userTicket) return res.sendStatus(404);
    const userTicketId = userTicket.id;
    console.log(enrollmentId, userTicketId);
    return res.send("ok");

    const ticketTypes = await ticketsService.getTicketTypes();
    /* const ticketType = ticketTypes.filter(userTicketValue)
    const userTicketValue = userTicket.;
    const a = { id: ticketSearched.id, status: ticketSearched.status, ticketTypeId: ticketSearched.ticketTypeId, enrollmentId: ticketSearched.enrollmentId, TicketType: ticketSearched.TicketType, createdAt: ticketSearched.createdAt, updatedAt: ticketSearched.updatedAt };
    return res.status(httpStatus.OK).send(ticket); */
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.send(httpStatus.NOT_FOUND);
    }
  }
}
