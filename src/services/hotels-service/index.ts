import { badRequestError, noContentError, notFoundError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import hotelsRepository from "@/repositories/hotels-repository";

async function getHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) {
    throw notFoundError();
  } else if(ticket.status!=="PAID") {
    throw badRequestError();
  }

  const hotels = await hotelsRepository.findAllHotelsInfo();

  if(hotels.length===0) {
    throw notFoundError();
  }

  return hotels;
}

async function getRoomsByHotelId(userId: number, hotelId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) {
    throw notFoundError();
  } else if(ticket.status!=="PAID") {
    throw badRequestError();
  }

  const hotelRooms = await hotelsRepository.findRoomsInHotel(hotelId);

  if(hotelRooms.length===0) {
    throw notFoundError();
  }

  return hotelRooms;
}

const hotelsService = {
  getHotels,
  getRoomsByHotelId,
};

export default hotelsService;
