import { IsString, MinLength, Matches , IsEmail } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: 'example@sparcs.org', description: 'email of user' })
  @IsEmail({}, {message: 'Invalid email address'})
  email: string;

  @ApiProperty({ example: 'badge', description: 'nickname of user' })
  @IsString()
  @MinLength(2, { message: 'Nickname must be at least 2 characters long' })
  nickname: string;

  @ApiProperty({ example: 'password123!', description: 'password of user' })
  @IsString()
  @MinLength(10, { message: 'Password must be at least 10 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/, {
    message: 'Password must include letters, numbers, and special characters',
  })
  password: string;
}
