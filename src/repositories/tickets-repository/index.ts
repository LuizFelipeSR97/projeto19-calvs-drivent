import { prisma } from "@/config";
import { TicketType, Ticket, Prisma } from "@prisma/client";
import { NETWORK_AUTHENTICATION_REQUIRED } from "http-status";

async function findTicketByEnrollmentId(enrollmentId: number) {
  const ticket = await prisma.ticket.findFirst({
    where: { enrollmentId: enrollmentId },
    include: { TicketType: true }
  });

  return ticket;
}

async function findTicketByTicketId(ticketId: number) {
  const ticket = await prisma.ticket.findFirst({
    where: { id: ticketId }
  });

  return ticket;
}

async function findTicketTypes() {
  const ticketTypes = await prisma.ticketType.findMany();
  return ticketTypes;
}

async function upsert(
  ticketId: number,
  enrollmentId: number,
  ticketTypeId: number
) {
  const createdOrUpdatedTicket = await prisma.ticket.upsert({
    where: {
      id: ticketId
    },
    create: {
      ticketTypeId,
      enrollmentId,
      status: "RESERVED",
      updatedAt: "2022-11-20 01:23:45", //DEPOIS MUDAR PARA NOW()
      createdAt: "2022-11-20 01:23:45", //DEPOIS MUDAR PARA NOW()
    },
    update: {
      ticketTypeId,
    },
  });
  console.log("tudo certo");
  return createdOrUpdatedTicket;
}

async function createTicket(
  ticketTypeId: number,
  enrollmentId: number
) {
  const createdTicket = await prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId,
      status: "RESERVED"
    },
    include: {
      TicketType: true
    }
  });
  return createdTicket;
}

async function updateTicket(
  ticketTypeId: number,
  enrollmentId: number,
  ticketId: number
) {
  const updatedTicket = await prisma.ticket.update({
    where: {
      id: ticketId
    },
    data: {
      ticketTypeId,
      enrollmentId,
      status: "RESERVED"
    },
    include: {
      TicketType: true
    }
  });
  return updatedTicket;
}

const ticketsRepository = {
  findTicketTypes,
  findTicketByTicketId,
  findTicketByEnrollmentId,
  upsert,
  createTicket,
  updateTicket
};

export default ticketsRepository;
