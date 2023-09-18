//app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TrpcModule } from './trpc/trpc.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [ConfigModule.forRoot(), TrpcModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
