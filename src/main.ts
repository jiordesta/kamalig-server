import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:4173',
      'https://kamalig-client.vercel.app/',
      'https://kamalig-client.vercel.app',
      'https://kamalig-client-snowy.vercel.app/',
      'https://kamalig-client-snowy.vercel.app',
    ];

    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
    });

    setInterval(
      async () => {
        try {
          await fetch('https://kamalig-server.onrender.com');
        } catch (err) {}
      },
      1000 * 60 * 14,
    );

    await app.listen(process.env.PORT || 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error: any) {
    console.error(`Failed to start application: ${error.message}`);
    setTimeout(bootstrap, 5000);
  }
}

bootstrap();
