import {IsString, IsOptional, MaxLength, IsInt, Min, Max} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateSpotcommentDto {
    @ApiProperty({ example: 'content', description: 'content of spot comment' })
    @IsString()
    @IsOptional()
    @MaxLength(50, { message: 'Content must be at most 50 characters long' })
    content?: string;

    @ApiProperty({ example: '4', description: 'rate spot (1~5)' })
    @IsInt()
    @Min(1, { message: 'minimum : 1'})
    @Max(5, { message: 'maximum : 5'})
    rate: number;
}
