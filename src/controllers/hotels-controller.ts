import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import ticketService from "@/services/tickets-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const hotelsList = await hotelsService.getHotels(userId);
    return res.send(hotelsList);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if (error.name === "BadRequestError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if (error.name === "NoContentError") {
      return res.sendStatus(httpStatus.NO_CONTENT);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getHotelRooms(req: AuthenticatedRequest, res: Response) {
  const hotelId = Number(req.params.hotelId);
  const { userId } = req;

  try {
    const roomsList = await hotelsService.getRoomsByHotelId(userId, hotelId);
    return res.send(roomsList); 
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if (error.name === "BadRequestError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if (error.name === "NoContentError") {
      return res.sendStatus(httpStatus.NO_CONTENT);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
