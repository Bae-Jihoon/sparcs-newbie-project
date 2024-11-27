import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    content: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    parentId?: number;
}
