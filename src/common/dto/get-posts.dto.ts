import {IsOptional, IsInt, IsString, IsEnum, Min, Max, IsIn} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetPostsDto {
    @IsOptional()
    @IsString()
    keyword?: string;

    @IsOptional()
    @IsIn(['title', 'content', 'title+content'])
    @IsString()
    searchType?: string;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Transform(({ value }) => {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? 20 : parsed; // 기본값 20 적용
    })
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 20;


    @IsOptional()
    @IsIn(['createdAt', 'likenum', 'commentnum'])
    sortField?: string = 'createdAt';

    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortBy?: string = 'desc';
}
