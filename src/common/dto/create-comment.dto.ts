import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateCommentDto {
    @ApiProperty({ example: 'content', description: 'content of comment' })
    @IsString()
    content: string;

    @ApiProperty({ example: '3 or null', description: 'id of parent comment' })
    @IsOptional()
    @IsInt()
    @Min(1)
    parentId?: number;
}
