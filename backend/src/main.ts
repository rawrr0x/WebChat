import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'WebChat',
    }),
  });

  const PORT = process.env.PORT || 5000;

  const config = new DocumentBuilder()
    .setTitle('WebChat')
    .setDescription('WebChat API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(PORT, () => Logger.log(`Server started on ${PORT}`));
}

bootstrap();
