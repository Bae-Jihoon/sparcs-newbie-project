import { Transform } from 'class-transformer';
import { IsDate, Matches } from 'class-validator';

export class UpdateStartedAtDto {
  @Transform(({ value }) => {
    // "YYYY-MM-DD" 형식의 문자열에 시간 추가 후 Date 객체로 변환
    console.log(value);
    const dateWithTime = `${value}T00:00:00.000Z`;
    console.log(dateWithTime);
    const date=new Date(dateWithTime)
    console.log(date);
    return date;
  })
  //@Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'startedAt must be in YYYY-MM-DD format' })
  @IsDate({ message: 'startedAt must be a valid Date' })
  startedAt: Date;
}