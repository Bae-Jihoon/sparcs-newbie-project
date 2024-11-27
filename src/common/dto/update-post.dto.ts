import {IsNotEmpty, IsOptional, IsString, MaxLength} from 'class-validator';

export class UpdatePostDto {
    @IsOptional()
    @IsString()
    @MaxLength(50, { message: 'Title must be at most 50 characters long'})
    title?: string;

    @IsOptional()
    @IsString()
    content?: string;
}
