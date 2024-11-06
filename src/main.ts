import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

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
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
