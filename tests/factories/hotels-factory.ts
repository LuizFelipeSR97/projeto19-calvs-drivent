import faker from "@faker-js/faker";
import { prisma } from "@/config";
import { TicketStatus } from "@prisma/client";

export async function createHotel() {
  return prisma.hotel.create({
    data:
      {
        name: faker.name.findName(),
        image: faker.image.imageUrl(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }
  });
}

export async function createHotelsRooms(hotelId: number) {
  return prisma.room.create({
    data:
      {
        id: 1,
        name: faker.name.findName(),
        capacity: faker.datatype.number({ min: 1, max: 10 }),
        hotelId: hotelId,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      },
  });
}
