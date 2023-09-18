//main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TrpcRouter } from './trpc/trpc.router';
import { PostRouter } from './post/post.router';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const trpc = app.get(TrpcRouter);
  const postRouter = app.get(PostRouter);
  postRouter.applyMiddleware(app);

  trpc.applyMidlewere(app);
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
