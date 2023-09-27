import { Module } from '@nestjs/common';
import { TrpcService } from 'apps/api/src/trpc/trpc.service';
import { TrpcRouter } from 'apps/api/src/trpc/trpc.router';
import { PrismaModule } from 'apps/api/src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [TrpcService, TrpcRouter],
})
export class TrpcModule {}
