// USAR DEMAIS TESTES COMO BASE

// TESTAR OS SEGUINTES CASOS PARA CADA ROTA:

// ROTA GET("/HOTELS")

//CASO 4: O USUARIO NAO TER TICKET
//STATUS 404 (NOT FOUND)
//CASO 5: O USUARIO NAO TER TICKET PAGO
//STATUS 400 (BAD REQUEST) -> status 404
//CASO 6: O USUARIO TER TICKET PAGO MAS NÃO TER PEGO A OPCAO COM HOTEL
//STATUS 400 (NOT FOUND)
//CASO 7: O USUARIO TER TICKET PAGO E COM A OPCAO COM HOTEL MAS NAO TER HOTEIS COMO OPCAO
//STATUS 404 (NOT FOUND)
//CASO 8: O USUARIO TER TICKET PAGO E COM A OPCAO COM HOTEL
//STATUS 200 (OK) E RETORNANDO TODOS OS HOTEIS

// TESTE CRIADO:
//CASO 1: NÃO TER SIDO PASSADO TOKEN
//STATUS 401 (UNAUTHORIZED)
//CASO 2: TER SIDO PASSADO O TOKEN ERRADO
//STATUS 401 (UNAUTHORIZED)
//CASO 3: TER SIDO PASSADO UM TOKEN SEM SESSION
//STATUS 401 (UNAUTHORIZED)
//CASO 4: O USUARIO NAO TER ENROLLMENT
//STATUS 204 (NO CONTENT)

import app, { init } from "@/app";
import { prisma } from "@/config";
import { generateCPF, getStates } from "@brazilian-utils/brazilian-utils";
import faker from "@faker-js/faker";
import dayjs from "dayjs";
import httpStatus, { EXPECTATION_FAILED } from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createEnrollmentWithAddress, createUser, createhAddressWithCEP, createTwoTicketTypes, createTicket, createHotel, createHotelsRooms } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});
//Fazer um beforeEach?

const server = supertest(app);

describe("GET /hotels", () => {
  describe("when token is not valid", () => {
    it("should respond with status 401 if no token is given", async () => {
      const response = await server.get("/hotels");
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it("should respond with status 401 if given token is not valid", async () => {
      const token = faker.lorem.word();
  
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it("should respond with status 401 if there is no session for given token", async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe("when token is valid", () => {
    it("should respond with status 204 when there is no enrollment for given user", async () => {
      const token = await generateValidToken();

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NO_CONTENT);
    });

    it("should respond with status 404 when there is no ticket for given user", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when ticket's payment status is not PAID", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      await createTwoTicketTypes();
      await createTicket(enrollment.id, 2, "RESERVED");

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when ticket type does not include hotel option", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      await createTwoTicketTypes();
      await createTicket(enrollment.id, 1, "PAID");

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with empty array when there are no hotels options created", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      await createTwoTicketTypes();
      await createTicket(enrollment.id, 2, "PAID");

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.body).toEqual([]);
    });

    it("should respond with status 200 and with all hotels options", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      await createTwoTicketTypes();
      await createTicket(enrollment.id, 2, "PAID");
      await createHotel();
      await createHotel();

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            image: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
          })
        ])
      );
    });
  });
});

describe("GET /hotels/:hotelId", () => {
  describe("when token is not valid", () => {
    it("should respond with status 401 if no token is given", async () => {
      const response = await server.get("/hotels");
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it("should respond with status 401 if given token is not valid", async () => {
      const token = faker.lorem.word();
  
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it("should respond with status 401 if there is no session for given token", async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe("when token is valid", () => {
    it("should respond with status 204 when there is no enrollment for given user", async () => {
      const token = await generateValidToken();

      const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NO_CONTENT);
    });

    it("should respond with status 404 when there is no ticket for given user", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when ticket's payment status is not PAID", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      await createTwoTicketTypes();
      await createTicket(enrollment.id, 2, "RESERVED");

      const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when ticket type does not include hotel option", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      await createTwoTicketTypes();
      await createTicket(enrollment.id, 1, "PAID");

      const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with empty array when there are no hotels options created", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      await createTwoTicketTypes();
      await createTicket(enrollment.id, 2, "PAID");

      const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);

      expect(response.body).toEqual([]);
    });

    it("should respond with status 400 when given hotelId does not exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      await createTwoTicketTypes();
      await createTicket(enrollment.id, 2, "PAID");
      const hotel = await createHotel();

      let hotelId = 1;
      if (hotelId===hotel.id) {
        hotelId+=1;
      }

      const response = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should respond with empty array when there are no rooms in the chosen hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      await createTwoTicketTypes();
      await createTicket(enrollment.id, 2, "PAID");
      const hotel = await createHotel();

      const hotelId = hotel.id;

      const response = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`);

      expect(response.body).toEqual([]);
    });

    it("should respond with status 200 and an array with all existing rooms in the chosen hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      await createTwoTicketTypes();
      await createTicket(enrollment.id, 2, "PAID");
      const hotel = await createHotel();
      const createdHotelId = hotel.id;
      const rooms = await createHotelsRooms(createdHotelId);

      const hotelId = hotel.id;

      const response = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          image: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          Rooms: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              capacity: expect.any(Number),
              hotelId: expect.any(Number),
              createdAt: expect.any(String),
              updatedAt: expect.any(String)
            })
          ])
        })
      );
    });
  });
});
