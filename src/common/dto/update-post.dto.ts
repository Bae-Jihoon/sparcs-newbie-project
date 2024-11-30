import {IsNotEmpty, IsOptional, IsString, MaxLength} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class UpdatePostDto {
    @ApiProperty({ example: 'updated title', description: 'update title of post' })
    @IsOptional()
    @IsString()
    @MaxLength(50, { message: 'Title must be at most 50 characters long'})
    title?: string;

    @ApiProperty({ example: 'updated content', description: 'update content of post' })
    @IsOptional()
    @IsString()
    content?: string;
}
