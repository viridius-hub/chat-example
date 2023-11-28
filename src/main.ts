import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {json, urlencoded} from "express";

async function bootstrap() {
  const PORT = Number(process.env.PORT) || 3000;
  const app: any = await NestFactory.create(AppModule, {cors: true});

  app.use(json({limit: '50mb'}));
  app.use(urlencoded({extended: true, limit: '50mb'}));
  app.set('trust proxy', true)

  await app.listen(PORT, () => console.log('Server started on port =', PORT));
}

bootstrap().catch(console.error);
