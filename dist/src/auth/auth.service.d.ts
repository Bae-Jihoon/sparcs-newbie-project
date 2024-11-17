import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateStartedAtDto } from '../dto/update-startedAt.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(email: string, nickname: string, password: string): Promise<{
        id: number;
        email: string;
        nickname: string;
        createdAt: Date;
    }>;
    updateStartedAt(userId: number, updateStartedAtDto: UpdateStartedAtDto): Promise<{
        id: number;
        email: string;
        nickname: string;
        password: string;
        startedAt: Date | null;
        createdAt: Date | null;
    }>;
    login(email: string, password: string): Promise<{
        access_token: string;
    }>;
}
