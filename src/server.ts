import fastify from "fastify"

import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUI from "@fastify/swagger-ui"
import fastifyCors from "@fastify/cors"

import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import { sendSms } from "./routes/send-sms"
import { errorHandler } from "./error-handler"

const app = fastify()

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'pass.in',
      description: 'Especificações da API para o back-end da aplicação pass.in construída durante o NLW Unite da Rocketseat.',
      version: '1.0.0'
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(sendSms)

app.setErrorHandler(errorHandler)

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running in http://localhost:3333')
})