import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import {PrismaService} from "../../prisma/prisma.service";
import {JwtStrategy} from "../auth/jwt.strategy";
import {UserService} from "./user.service";

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtStrategy],
})
export class UserModule {}
