import Joi from "joi";

const ticketValidationSchema = Joi.object({
  ticketTypeId: Joi.number().required(),
});

const paymentValidationSchema = Joi.object({
  ticketId: Joi.number().required(),
  cardData: Joi.object({
    issuer: Joi.string().required(),
    number: Joi.number().required(),
    name: Joi.string().required(),
    expirationDate: Joi.date().required(),
    cvv: Joi.number().required()
  })
});

export { ticketValidationSchema, paymentValidationSchema };
