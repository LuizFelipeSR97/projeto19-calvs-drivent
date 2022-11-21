import { notFoundError } from "@/errors";
import ticketsRepository from "@/repositories/tickets-repository";
import paymentsRepository from "@/repositories/payments-repository";

async function getPaymentByTicketId(ticketId: string) {
  const ticketIdConvertedToNumber = parseInt(ticketId);

  const paymentInfo = await paymentsRepository.findPaymentInfoByTicketId(ticketIdConvertedToNumber);

  return paymentInfo;
}

async function postPayment(enrollmentId: number) {
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollmentId);

  if (!ticket) throw notFoundError();

  return ticket;
}

const PaymentsService = {
  getPaymentByTicketId,
  postPayment
};

export default PaymentsService;
