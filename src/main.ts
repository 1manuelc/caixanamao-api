import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  );
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://192.168.0.118:5173',
      'http://localhost:5173',
      'https://caixanamao-git-multiset-register-jaqueline-uchoas-projects.vercel.app',
      'https://caixanamao.vercel.app/',
      'https://caixanamao-nyg080hb1-jaqueline-uchoas-projects.vercel.app',
      'https://caixanamao-guencfjhz-jaqueline-uchoas-projects.vercel.app',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.setGlobalPrefix('/api');
  app.set('trust proxy', 1);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
