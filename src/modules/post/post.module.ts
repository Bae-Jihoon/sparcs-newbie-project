import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import {PostService} from "./post.service";
import {PrismaService} from "../../../prisma/prisma.service";
import {JwtStrategy} from "../auth/jwt.strategy";
import {S3Service} from "../../services/s3.service";

@Module({
  controllers: [PostController],
  providers: [PostService, PrismaService, JwtStrategy, S3Service],
})
export class PostModule {}
