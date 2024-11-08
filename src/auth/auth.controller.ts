import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateStartedAtDto } from "../dto/update-startedAt.dto";

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
    return this.authService.updateStartedAt(+userId, updateStartedAtDto);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string
  ) {
    return this.authService.login(email, password);
  }
}
