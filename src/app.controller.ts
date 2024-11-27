import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Res
} from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { AppService } from './app.service';
import { UserService } from './modules/user/user.service';
import { PostService } from './modules/post/post.service';
import { User as UserModel, Post as PostModel } from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly appService: AppService,
  ) {}

  @Get('/')
  renderHomePage(@Res() res: Response) {
    res.sendFile(join(__dirname, '../../../newbie-project-client/index.html'));
  }


}
