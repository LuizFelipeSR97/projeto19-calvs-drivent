import { AuthenticatedRequest } from "@/middlewares";
import enrollmentsService from "@/services/enrollments-service";
import ticketsService from "@/services/tickets-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketType = await ticketsService.getTicketTypes();
    return res.status(httpStatus.OK).send(ticketType);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
    if(!enrollment) return res.sendStatus(httpStatus.NOT_FOUND);
    const enrollmentId = enrollment.id;
    const ticketSearched = await ticketsService.getTicketByEnrollmentId(enrollmentId);
    const ticket = { id: ticketSearched.id, status: ticketSearched.status, ticketTypeId: ticketSearched.ticketTypeId, enrollmentId: ticketSearched.enrollmentId, TicketType: ticketSearched.TicketType, createdAt: ticketSearched.createdAt, updatedAt: ticketSearched.updatedAt };
    return res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.send(httpStatus.NOT_FOUND);
    }
  }
}

export async function postCreateOrUpdateTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body;

  try {
    const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
    if (!enrollment) return res.sendStatus(httpStatus.NOT_FOUND);
    const enrollmentId = enrollment.id;
    let ticketId: number;

    const ticket = await ticketsService.isThereTicket(enrollmentId);

    if (!ticket) {
      ticketId=null;
      console.log(ticketId);
      const createdTicket = await ticketsService.upsertTicket(enrollmentId, ticketId, ticketTypeId);
      res.status(httpStatus.CREATED).send(createdTicket);
    } else {
      ticketId=ticket.id;
      console.log(ticketId);
      const updatedTicket = await ticketsService.upsertTicket(enrollmentId, ticketId, ticketTypeId);
      res.status(httpStatus.OK).send(updatedTicket);
    }

    console.log("foi");
    return;

    console.log("teste3");

    return;

    return;

    return res.send("ok");
    
    /* const ticket = {
      id: number,
      status: string, //RESERVED | PAID
      ticketTypeId: number,
      enrollmentId: number,
      TicketType: {
        id: number,
        name: string,
        price: number,
        isRemote: boolean,
        includesHotel: boolean,
        createdAt: Date,
        updatedAt: Date,
      },
      createdAt: Date,
      updatedAt: Date,
    } */

    const existingTicket2 = await ticketsService.getTicketByEnrollmentId(enrollmentId);

    const searchedTicket = await ticketsService.getTicketByEnrollmentId(userId);

    /* if (searchedTicket.length===0){

      const createdTicket = await ticketsService.createTicketByUserId(userId);
      return res.status(httpStatus.CREATED).send(createdTicket)

    } else {

      const updatedTicket = await ticketsService.updateTicketByUserId(userId);
      return res.status(httpStatus.CREATED).send(updatedTicket)

    } */
    return;
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

//criar o @/tickets-service, declarar o ticketsService = {getTicketTypes}
