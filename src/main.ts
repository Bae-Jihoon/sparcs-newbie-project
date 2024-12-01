import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // 추가
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const NODE_ENV = process.env.NODE_ENV || 'local';

const envFilePath = path.resolve(__dirname, `../.env.${NODE_ENV}`);
if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath });
  console.log(`Loaded environment variables from ${envFilePath}`);
} else {
  dotenv.config(); // 기본 .env 파일 로드
  console.log('Loaded environment variables from default .env file');
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // NestExpressApplication 사용

  // ValidationPipe 설정
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));

  const config = new DocumentBuilder()
      .setTitle('Heup-Pot')
      .setDescription('The API description')
      .setVersion('1.0')
      .addCookieAuth()
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  //app.useStaticAssets(join(__dirname, '..', '..', '..', 'newbie-project-client')); // 정적 파일 경로 지정
  app.enableCors({
    origin: 'http://localhost:3000', // 클라이언트 URL
    credentials: true, // 쿠키 등 허용
  });
  await app.listen(process.env.PORT || 3000);
  console.log('PORT:', process.env.PORT || 3000);

}
bootstrap();
