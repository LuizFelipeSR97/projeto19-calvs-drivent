import { prisma } from "@/config";
import { Hotel } from "@prisma/client";

async function findAllHotelsInfo() {
  return prisma.hotel.findMany({
    where: {
    }
  });
}

async function findRoomsInHotel(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId: hotelId
    }
  });
}

export type PaymentParams = Omit<Hotel, "id" | "createdAt" | "updatedAt">

const hotelsRepository = {
  findAllHotelsInfo,
  findRoomsInHotel,
};

export default hotelsRepository;
