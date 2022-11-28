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

//Funcao pra criar dois quartos em cada um dos dois hoteis

export async function createHotelsRooms() {
  return prisma.room.createMany({
    data: [
      {
        id: 1,
        name: faker.name.findName(),
        capacity: faker.datatype.number({ min: 1, max: 10 }),
        hotelId: 1,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      },
      {
        id: 2,
        name: faker.name.findName(),
        capacity: faker.datatype.number({ min: 1, max: 10 }),
        hotelId: 1,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      },
      {
        id: 3,
        name: faker.name.findName(),
        capacity: faker.datatype.number({ min: 1, max: 10 }),
        hotelId: 2,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      },
      {
        id: 4,
        name: faker.name.findName(),
        capacity: faker.datatype.number({ min: 1, max: 10 }),
        hotelId: 2,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }
    ],
  });
}
