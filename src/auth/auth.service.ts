import { BadRequestException, Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateStartedAtDto } from '../dto/update-startedAt.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, nickname: string, password: string) {

    const existingEmail = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      throw new BadRequestException('Email is already in use');
    }

    const existingName = await this.prisma.user.findUnique({
      where: { nickname },
    });
    if (existingName) {
      throw new BadRequestException('Nickname is already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        createdAt: true,
      },
    });
    return user;
  }

  async updateStartedAt(userId: number, updateStartedAtDto: UpdateStartedAtDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId} });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log(updateStartedAtDto.startedAt);
    return this.prisma.user.update({
      where: { id: userId },
      data: { startedAt: updateStartedAtDto.startedAt },
    });
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
