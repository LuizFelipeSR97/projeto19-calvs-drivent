import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";

//type GetTicketByUserIdResult = Ticket + TicketType (dentro de Ticket)

/* async function getTicketByUserId(userId: number):Promise<GetTicketByUserIdResult>{

} */

async function getTicketTypes() {
  const ticket = await ticketsRepository.findTicketTypes();

  if (!ticket) throw notFoundError();

  return ticket;
}

async function getTicketByEnrollmentId(enrollmentId: number) {
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollmentId);

  return ticket;
}

async function getTicketByTicketId(ticketId: number) {
  const ticket = await ticketsRepository.findTicketByTicketId(ticketId);

  return ticket;
}

async function isThereTicket(enrollmentId: number) {
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollmentId);

  return ticket;
}

async function upsertTicketByEnrollmentId(enrollmentId: number, ticketTypeId: number) {
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollmentId);

  console.log(ticketTypeId, ticket);
  return ticket;
  
  //Se nao existe, cria um novo
  //Se existe, atualiza

  if (!ticket) throw notFoundError();

  return ticket;
}

async function upsertTicket(enrollmentId: number, ticketId: number, ticketTypeId: number) {
  let createdOrUpdatedTicket;

  if (ticketId===null) {
    //Criar ticket
    createdOrUpdatedTicket = await ticketsRepository.createTicket(ticketTypeId, enrollmentId);
  } else {
    //Atualizar ticket
    createdOrUpdatedTicket = await ticketsRepository.updateTicket(ticketTypeId, enrollmentId, ticketId);
  }

  if (!createdOrUpdatedTicket.id) throw notFoundError();

  createdOrUpdatedTicket = {
    id: createdOrUpdatedTicket.id,
    status: createdOrUpdatedTicket.status,
    ticketTypeId: createdOrUpdatedTicket.ticketTypeId,
    enrollmentId: createdOrUpdatedTicket.enrollmentId,
    TicketType: createdOrUpdatedTicket.TicketType,
    createdAt: createdOrUpdatedTicket.createdAt,
    updatedAt: createdOrUpdatedTicket.updatedAt
  };

  return createdOrUpdatedTicket;
}

const ticketsService = {
  getTicketTypes,
  getTicketByEnrollmentId,
  getTicketByTicketId,
  upsertTicketByEnrollmentId,
  upsertTicket,
  isThereTicket
};

export default ticketsService;
