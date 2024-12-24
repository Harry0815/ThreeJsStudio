import fastifyCookie from '@fastify/cookie';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';
import { description, name, version } from '../project.json';
import { AppModule } from './app/app.module';

const bootstrap = async () => {
  // Instantiate Fastify with some config
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  await app
    .getHttpAdapter()
    .getInstance()
    .register(fastifyCookie, {
      parseOptions: {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 90,
      },
    });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT ?? 3002;
  app.enableCors();
  const logger = new Logger();
  app.useLogger(logger);

  /**
   * Set up Swagger / OpenAPI
   *
   * @see https://docs.nestjs.com/openapi/introduction
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const config = new DocumentBuilder().setTitle(name).setDescription(description).setVersion(version).build();

  patchNestJsSwagger();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Start listening.
  await app.listen(port, (err) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (err) {
      logger.error(err);
      process.exit(1);
    } else {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      logger.log(`[ ready ] http://localhost:${port}/${globalPrefix}`);
    }
  });
};

bootstrap();
