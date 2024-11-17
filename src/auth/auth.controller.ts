import { Controller, Post, Body, Patch, Param, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateStartedAtDto } from "../dto/update-startedAt.dto";
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto : CreateUserDto) {
    const { email, nickname, password } = createUserDto;
    return this.authService.register(email, nickname, password);
  }

  @Patch(':userId/startedAt')
  async updateStartedAt(
    @Param('userId') userId: string,
    @Body() updateStartedAtDto: UpdateStartedAtDto,
  ) {
    console.log(updateStartedAtDto);
    return this.authService.updateStartedAt(+userId, updateStartedAtDto);
  }

  @Post('login')
  async login(
      @Body('email') email: string,
      @Body('password') password: string,
      @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token } = await this.authService.login(email, password);

    // 쿠키에 JWT 설정
    response.cookie('access_token', access_token, {
      httpOnly: false,
      secure: false,
      sameSite: 'none',     //나중에 수정
    });

    return { message: 'Login successful' };
  }
}
