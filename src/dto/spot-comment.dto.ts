import {IsString, IsOptional, MaxLength, IsInt, Min, Max} from 'class-validator';

export class SpotCommentDto {
    @IsString()
    @IsOptional()
    @MaxLength(50, { message: 'content must be at most 50 characters long' })
    content?: string;

    @IsInt()
    @Min(1)
    @Max(5)
    rate: number;
}
