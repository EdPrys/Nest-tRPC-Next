//app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from 'apps/api/src/database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TrpcModule } from 'apps/api/src/trpc/trpc.module';

@Module({
  imports: [ConfigModule.forRoot(), TrpcModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
