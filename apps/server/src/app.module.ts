//app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '@server/database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TrpcModule } from '@server/trpc/trpc.module';

@Module({
  imports: [ConfigModule.forRoot(), TrpcModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
