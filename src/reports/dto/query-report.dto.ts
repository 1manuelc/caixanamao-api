import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class QueryReportDto {
  @Transform(({ value }) => {
    if (value === 'false') return false;
    if (value === 'true') return true;
    return Boolean(value);
  })
  @IsBoolean()
  @IsOptional()
  includeValues: string;
}
