import {IsNotEmpty, IsString, MaxLength} from 'class-validator';

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50, { message: 'Title must be at most 50 characters long'})
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}
