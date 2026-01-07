import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { UpdateReportDto } from './dtos/update-report.dto';
import { QueryReportDto } from './dtos/query-report.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/roles.enum';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @Roles([RolesEnum.OPERADOR, RolesEnum.ADMIN])
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @Get()
  @Roles([RolesEnum.OPERADOR, RolesEnum.ADMIN])
  findAll(@Query() queryReportDto: QueryReportDto) {
    return this.reportsService.findAll(queryReportDto);
  }

  @Get(':id')
  @Roles([RolesEnum.OPERADOR, RolesEnum.ADMIN])
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.findOne(id);
  }

  @Patch(':id')
  @Roles([RolesEnum.OPERADOR, RolesEnum.ADMIN])
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    return this.reportsService.update(id, updateReportDto);
  }

  @Delete(':id')
  @Roles([RolesEnum.OPERADOR, RolesEnum.ADMIN])
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.remove(id);
  }
}
