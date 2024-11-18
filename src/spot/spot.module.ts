import { Module } from '@nestjs/common';
import { SpotService } from './spot.service';
import { SpotController } from './spot.controller';
import { PrismaService } from "../../prisma/prisma.service";
import { JwtStrategy } from "../auth/jwt.strategy";

@Module({
  providers: [SpotService, PrismaService, JwtStrategy],
  controllers: [SpotController]
})
export class SpotModule {}
