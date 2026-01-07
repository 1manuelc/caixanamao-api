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
import { RegistersService } from './registers.service';
import { CreateRegisterDto } from './dtos/create-register.dto';
import { UpdateRegisterDto } from './dtos/update-register.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/roles.enum';

@Controller('registers')
export class RegistersController {
  constructor(private readonly registersService: RegistersService) {}

  @Post()
  @Roles([RolesEnum.OPERADOR, RolesEnum.ADMIN])
  create(@Body() createRegisterDto: CreateRegisterDto) {
    return this.registersService.create(createRegisterDto);
  }

  @Get()
  @Roles([RolesEnum.OPERADOR, RolesEnum.ADMIN])
  findAll(@Query() paginationDto: PaginationDto) {
    return this.registersService.findAll(paginationDto);
  }

  @Get(':id')
  @Roles([RolesEnum.OPERADOR, RolesEnum.ADMIN])
  findOne(@Param('id') id: string) {
    return this.registersService.findOne(id);
  }

  @Patch(':id')
  @Roles([RolesEnum.OPERADOR, RolesEnum.ADMIN])
  update(
    @Param('id') id: string,
    @Body() updateRegisterDto: UpdateRegisterDto,
  ) {
    return this.registersService.update(id, updateRegisterDto);
  }

  @Delete(':id')
  @Roles([RolesEnum.OPERADOR, RolesEnum.ADMIN])
  remove(@Param('id') id: string) {
    return this.registersService.remove(id);
  }
}
