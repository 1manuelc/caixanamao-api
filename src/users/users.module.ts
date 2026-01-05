import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PasswordService } from 'src/common/password/password.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PasswordService],
})
export class UsersModule {}
