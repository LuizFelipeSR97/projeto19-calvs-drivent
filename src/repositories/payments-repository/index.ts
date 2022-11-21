import { prisma } from "@/config";
import { TicketType, Ticket, Prisma } from "@prisma/client";
import { NETWORK_AUTHENTICATION_REQUIRED } from "http-status";

async function findPaymentInfoByTicketId(ticketId: number) {
  const ticket = await prisma.payment.findFirst({
    where: { ticketId: ticketId }
  });
  if (ticket===null) {
    console.log("teste");
  }
  console.log(ticket);

  return ticket;
}

const paymentsRepository = {
  findPaymentInfoByTicketId
};

export default paymentsRepository;
