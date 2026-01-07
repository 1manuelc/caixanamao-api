import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/roles.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles([RolesEnum.OPERADOR, RolesEnum.ADMIN])
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Get(':id')
  @Roles([RolesEnum.OPERADOR, RolesEnum.ADMIN])
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles([RolesEnum.OPERADOR, RolesEnum.ADMIN])
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles([RolesEnum.OPERADOR, RolesEnum.ADMIN])
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
