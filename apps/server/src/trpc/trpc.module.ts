import { Module } from '@nestjs/common';
import { TrpcService } from '@server/trpc/trpc.service';
import { TrpcRouter } from '@server/trpc/trpc.router';
import { PrismaModule } from '@server/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [TrpcService, TrpcRouter],
})
export class TrpcModule {}
