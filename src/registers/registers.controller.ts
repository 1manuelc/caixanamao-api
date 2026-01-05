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

@Controller('registers')
export class RegistersController {
  constructor(private readonly registersService: RegistersService) {}

  @Post()
  create(@Body() createRegisterDto: CreateRegisterDto) {
    return this.registersService.create(createRegisterDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.registersService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRegisterDto: UpdateRegisterDto,
  ) {
    return this.registersService.update(id, updateRegisterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registersService.remove(id);
  }
}
