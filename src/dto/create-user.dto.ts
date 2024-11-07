import { IsString, MinLength, Matches , IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, {message: 'Invalid email address'})
  email: string;

  @IsString()
  @MinLength(2, { message: 'Nickname must be at least 2 characters long' })
  nickname: string;

  @IsString()
  @MinLength(10, { message: 'Password must be at least 10 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/, {
    message: 'Password must include letters, numbers, and special characters',
  })
  password: string;
}
