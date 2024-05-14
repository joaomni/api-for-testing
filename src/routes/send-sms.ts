import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { FastifyInstance } from "fastify";
import { BadRequest } from "./_errors/bad-request";
import dotenv from 'dotenv';
dotenv.config();
import pkg from 'twilio'
const { Twilio } = pkg

const twilio: Twilio = singleton<Twilio>(
  'twilio',
  () =>
    new Twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN),
);

export function singleton<Value>(name: string, value: () => Value): Value {
  const g = global as any;
  g.__singletons ??= {};
  g.__singletons[name] ??= value();
  return g.__singletons[name];
}

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

      twilio.messages
        .create({
          body:     text,
          from: "+14793703859",
          to: "+5513991027026",
        })

      return reply.status(201).send({ messageSms: text });
    }
  );
}
