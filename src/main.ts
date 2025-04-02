import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  app.enableCors();

  // app.useGlobalGuards(new JwtAuthGuard());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
