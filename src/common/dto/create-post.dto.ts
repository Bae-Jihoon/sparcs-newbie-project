import {IsNotEmpty, IsString, MaxLength} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreatePostDto {
    @ApiProperty({ example: 'title', description: 'title of post' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50, { message: 'Title must be at most 50 characters long'})
    title: string;

    @ApiProperty({ example: 'content', description: 'content of post' })
    @IsNotEmpty()
    @IsString()
    content: string;
}
