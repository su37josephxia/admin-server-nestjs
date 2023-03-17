import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { generateDocument } from './doc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 添加数据校验
  app.useGlobalPipes(new ValidationPipe())

  // 创建文档
  generateDocument(app)

  await app.listen(3000);
}
bootstrap();

