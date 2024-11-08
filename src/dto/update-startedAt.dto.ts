import { IsDate, IsDateString, IsISO8601 } from "class-validator";
import { Type } from 'class-transformer';

export class UpdateStartedAtDto {
  @IsDate ()
  @Type(() => Date)
  startedAt?: Date;
}