import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import {PostService} from "./post.service";
import {PrismaService} from "../../prisma/prisma.service";
import {JwtStrategy} from "../auth/jwt.strategy";

@Module({
  controllers: [PostController],
  providers: [PostService, PrismaService, JwtStrategy],
})
export class PostModule {}
