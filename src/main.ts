import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const puerto = Number(process.env.PUERTO_SERVIDOR);

  const app = await NestFactory.create(AppModule);
     app.enableCors();
    await app.listen(puerto, () => {
   console.log(`Servidor funcionando puerto: ${puerto}`);
   });

    }
bootstrap();
