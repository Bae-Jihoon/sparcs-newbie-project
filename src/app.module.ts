import {Logger, MiddlewareConsumer, Module} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './modules/user/user.service';
import { PostService } from './modules/post/post.service';
import { SpotService } from './modules/spot/spot.service';
import { ReverseGeocodingService } from "./services/reverse-geocoding.service";
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { JwtStrategy } from "./modules/auth/jwt.strategy";
import { SpotModule } from './modules/spot/spot.module';
import * as cookieParser from 'cookie-parser';
import { S3Service } from "./services/s3.service";
import {join} from "path";
import {ServeStaticModule} from "@nestjs/serve-static";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'newbie-project-client'),
      serveRoot: '/', // '/' 경로에서 정적 파일 제공
    }),
    AuthModule,
    UserModule,
    PostModule,
    SpotModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserService,
    PostService,
    SpotService,
    ReverseGeocodingService,
    PrismaService,
    JwtStrategy,
    S3Service
  ],
})
export class AppModule {
  constructor() {
    Logger.log(`Static files served from: ${join(__dirname, '..', '..', 'newbie-project-client')}`);
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*'); // 모든 라우트에 cookie-parser 적용
  }
}
