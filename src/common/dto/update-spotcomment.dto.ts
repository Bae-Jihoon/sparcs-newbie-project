import {IsString, IsOptional, MaxLength, IsInt, Min, Max} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class UpdateSpotcommentDto {
    @ApiProperty({ example: 'updated content', description: 'update content of spot comment' })
    @IsOptional()
    @IsString()
    @MaxLength(50, { message: 'Content must be at most 50 characters long' })
    content?: string;

    @ApiProperty({ example: 'updated rate', description: 'update rate of spot' })
    @IsOptional()
    @IsInt()
    @Min(1, { message: 'minimum : 1'})
    @Max(5, { message: 'maximum : 5'})
    rate?: number;
}
