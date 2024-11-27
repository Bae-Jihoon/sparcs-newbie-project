import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../../common/dto/create-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //AUTH-001 (회원 가입)
  @Post('register')
  async register(@Body() createUserDto : CreateUserDto) {
    const { email, nickname, password } = createUserDto;
    return this.authService.register(email, nickname, password);
  }

  //AUTH-002 (사용자 로그인)
  @Post('login')
  async login(
      @Body('email') email: string,
      @Body('password') password: string,
      @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token } = await this.authService.login(email, password);

    response.cookie('access_token', access_token, {
      httpOnly: false,
      secure: false,
      sameSite: 'none',     //나중에 수정
    });

    return { message: 'Login successful' };
  }

  //AUTH-003 (사용자 로그아웃)
  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('access_token', {
      httpOnly: false,
      secure: false,
      sameSite: 'none',     //나중에 수정
    });

    return res.status(200).json({ message: 'Logout successful' });
  }
}
