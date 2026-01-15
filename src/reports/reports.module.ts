import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { RegistersService } from 'src/registers/registers.service';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, RegistersService],
})
export class ReportsModule {}
