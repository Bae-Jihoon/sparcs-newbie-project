import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateStartedAtDto } from "../dto/update-startedAt.dto";
import { Response } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<{
        id: number;
        email: string;
        nickname: string;
        createdAt: Date;
    }>;
    updateStartedAt(userId: string, updateStartedAtDto: UpdateStartedAtDto): Promise<{
        id: number;
        email: string;
        nickname: string;
        password: string;
        startedAt: Date | null;
        createdAt: Date | null;
    }>;
    login(email: string, password: string, response: Response): Promise<{
        message: string;
    }>;
}
