import { INestApplication, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from '@server/trpc/trpc.service';
import * as trpcExpress from '@trpc/server/adapters/express';

@Injectable()
export class TrpcRouter {
  constructor(private readonly trpc: TrpcService) {}

  private postRouter = this.trpc.createTRPCRouter({
    all: this.trpc.publicProcedure.query(({ ctx }) => {
      return ctx.prisma.post.findMany();
    }),
    byId: this.trpc.publicProcedure
      .input(z.string())
      .query(({ ctx, input }) => {
        return ctx.prisma.post.findFirst({ where: { id: input } });
      }),
  });

  private appRouter = this.trpc.createTRPCRouter({
    post: this.postRouter,
    // hello: this.trpc.publicProcedure
    //   .input(z.object({ name: z.string().optional() }))
    //   .query(({ input }) => {
    //     return `Hello ${input.name ?? `Bilbo`}`;
    //   }),
  });

  async applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({
        router: this.appRouter,
        createContext: this.trpc.createTRPCContext,
      }),
    );
  }
}

export type AppRouter = TrpcRouter[`appRouter`];
