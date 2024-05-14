import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { FastifyInstance } from "fastify";
import { BadRequest } from "./_errors/bad-request";

require('dotenv').config()

const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN
const client = require("twilio")(accountSid, authToken);

export async function sendSms(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/sms",
    {
      schema: {
        summary: "Send SMS",
        tags: ["sms"],
        body: z.object({
          name: z.string().min(4),
          contact: z.string().min(4),
          company: z.string().min(4),
          instagram: z.string().min(4),
        }),
        response: {
          201: z.object({
            messageSms: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, contact, company, instagram } = request.body;

      const text = "Nome: "+name+", WhatsApp: "+contact+", Empresa: "+company+", Instagram: "+instagram

      console.log(text)

      client.messages
        .create({
          body:     text,
          from: "+14793703859",
          to: "+5513991027026",
        })
        .then((message) => console.log(message.sid))
        .done()

      return reply.status(201).send({ messageSms: text });
    }
  );
}
