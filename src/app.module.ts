import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './common/prisma/prisma.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CheckAuthMiddleware } from './common/middlewares/check-auth.middleware';
import { UsersModule } from './users/users.module';
import { RegistersModule } from './registers/registers.module';
import { ReportsModule } from './reports/reports.module';
import { CompaniesModule } from './companies/companies.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { JwtService } from './common/jwt/jwt.service';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 30000, // 30s
        limit: 16, // max de reqs por IP dentro do TTL
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    RegistersModule,
    ReportsModule,
    CompaniesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    JwtService,
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckAuthMiddleware)
      .exclude('/auth/*path')
      .forRoutes('/*path');
  }
}
