import {MiddlewareConsumer, Module} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { PostService } from './post/post.service';
import { SpotService } from './spot/spot.service';
import { ReverseGeocodingService } from "./geocode/reverse-geocoding.service";
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { JwtStrategy } from "./auth/jwt.strategy";
import { SpotModule } from './spot/spot.module';
import * as cookieParser from 'cookie-parser';
import { S3Service } from "./s3/s3.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
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
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*'); // 모든 라우트에 cookie-parser 적용
  }
}
