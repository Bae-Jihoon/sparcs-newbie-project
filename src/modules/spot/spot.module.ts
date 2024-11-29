import { Module } from '@nestjs/common';
import { SpotService } from './spot.service';
import { SpotController } from './spot.controller';
import { ReverseGeocodingService } from "../../services/reverse-geocoding.service";
import { PrismaService } from "../../../prisma/prisma.service";
import { JwtStrategy } from "../auth/jwt.strategy";
import {join} from "path";
import {ServeStaticModule} from "@nestjs/serve-static";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'newbie-project-client'),
      serveRoot: '/spots', // /spots 경로로 요청되는 정적 파일 제공
    }),
  ],
  providers: [SpotService, ReverseGeocodingService, PrismaService, JwtStrategy],
  controllers: [SpotController]
})
export class SpotModule {}
