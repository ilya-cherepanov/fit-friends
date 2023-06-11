import {Logger, ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app/app.module';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {PrismaService} from './app/prisma/prisma.service';
import {GLOBAL_PREFIX} from './constants';
import {cp} from 'node:fs/promises';
import {resolve} from 'path';
import {ConfigService} from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Fit Friends')
    .setDescription('Fit Friends API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('spec', app, document);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  app.enableCors();

  const configService = app.get<ConfigService>(ConfigService);

  await cp(
    resolve(__dirname, 'assets/photos'),
    configService.get<string>('upload.directory'),
    {force: true, recursive: true}
  );

  await cp(
    resolve(__dirname, 'assets/videos'),
    `${configService.get<string>('upload.directory')}/videos`,
    {force: true, recursive: true}
  );

  app.setGlobalPrefix(GLOBAL_PREFIX);
  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${GLOBAL_PREFIX}`
  );
}

bootstrap();
