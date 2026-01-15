import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class QueryReportDto extends PaginationDto {
  @Transform(({ value }) => {
    if (value === 'false') return false;
    if (value === 'true') return true;
    return Boolean(value);
  })
  @IsBoolean()
  @IsOptional()
  includeValues: string;

  @Transform(({ value }) => {
    if (value === 'false') return false;
    if (value === 'true') return true;
    return Boolean(value);
  })
  @IsBoolean()
  @IsOptional()
  includeRegisters: string;
}
