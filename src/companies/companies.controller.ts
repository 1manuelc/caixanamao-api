import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/roles.enum';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles([RolesEnum.OPERADOR, RolesEnum.ADMIN])
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @Roles([RolesEnum.OPERADOR, RolesEnum.ADMIN])
  findAll(@Query() paginationDto: PaginationDto) {
    return this.companiesService.findAll(paginationDto);
  }

  @Get(':id')
  @Roles([RolesEnum.OPERADOR, RolesEnum.ADMIN])
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(+id);
  }

  @Patch(':id')
  @Roles([RolesEnum.OPERADOR, RolesEnum.ADMIN])
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  @Roles([RolesEnum.OPERADOR, RolesEnum.ADMIN])
  remove(@Param('id') id: string) {
    return this.companiesService.remove(+id);
  }
}
