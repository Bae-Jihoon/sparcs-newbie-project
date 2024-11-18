import { Module } from '@nestjs/common';
import { SpotService } from './spot.service';
import { SpotController } from './spot.controller';
import { ReverseGeocodingService } from "../geocode/reverse-geocoding.service";
import { PrismaService } from "../../prisma/prisma.service";
import { JwtStrategy } from "../auth/jwt.strategy";

@Module({
  providers: [SpotService, ReverseGeocodingService, PrismaService, JwtStrategy],
  controllers: [SpotController]
})
export class SpotModule {}
