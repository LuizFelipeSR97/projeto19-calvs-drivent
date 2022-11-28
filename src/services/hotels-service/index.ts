import { badRequestError, noContentError, notFoundError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import hotelsRepository from "@/repositories/hotels-repository";

async function getHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw noContentError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  const ticketTypes = await ticketRepository.findTicketTypes();
  const ticketTypeWithHotel = ticketTypes.filter(type => type.includesHotel);

  if (!ticket) {
    throw notFoundError();
  } else if(ticket.status!=="PAID" || ticket.ticketTypeId !== ticketTypeWithHotel[0].id) {
    throw notFoundError();
  }

  const hotels = await hotelsRepository.findAllHotelsInfo();

  return hotels;
}

async function getRoomsByHotelId(userId: number, hotelId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw noContentError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  const ticketTypes = await ticketRepository.findTicketTypes();
  const ticketTypeWithHotel = ticketTypes.filter(type => type.includesHotel);

  if (!ticket) {
    throw notFoundError();
  } else if(ticket.status!=="PAID" || ticket.ticketTypeId !== ticketTypeWithHotel[0].id) {
    throw notFoundError();
  }

  const hotels = await hotelsRepository.findAllHotelsInfo();
  if (hotels.length===0) {
    return hotels;
  }

  const hotel = hotels.filter(hotel => hotel.id===hotelId);
  if (hotel.length===0) {
    throw badRequestError();
  }

  const hotelInfo = hotel[0];

  const hotelRooms = await hotelsRepository.findRoomsInHotel(hotelId);
  if (hotelRooms.length===0) {
    return hotelRooms;
  }

  return {
    id: hotelInfo.id,
    name: hotelInfo.name,
    image: hotelInfo.image,
    createdAt: hotelInfo.createdAt,
    updatedAt: hotelInfo.updatedAt,
    Rooms: hotelRooms
  };
}

const hotelsService = {
  getHotels,
  getRoomsByHotelId,
};

export default hotelsService;
