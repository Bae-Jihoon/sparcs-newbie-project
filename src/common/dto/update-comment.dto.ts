import { IsString, } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class UpdateCommentDto {
    @ApiProperty({ example: 'updated comment', description: 'update content of comment' })
    @IsString()
    content: string;
}