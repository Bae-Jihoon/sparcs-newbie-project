import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {UserData} from "../types/user-data.interface";

export const JWTUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): UserData => {
        const request = ctx.switchToHttp().getRequest();
        return request.user; // req.user에서 데이터를 가져옵니다.
    },
);
