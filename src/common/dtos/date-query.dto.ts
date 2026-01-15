import { IsISO8601, IsOptional } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class DateQueryDto extends PaginationDto {
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @IsOptional()
  @IsISO8601()
  endDate?: string;
}
