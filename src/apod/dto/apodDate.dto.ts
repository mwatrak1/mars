import { IsDateString, IsNotEmpty } from 'class-validator';

export class ApodDateDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;
}
