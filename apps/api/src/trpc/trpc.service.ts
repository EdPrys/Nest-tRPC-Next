//trpc.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'apps/api/src/database/prisma.service';
import { initTRPC, TRPCError, inferAsyncReturnType } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

// Usable types only for next-auth
// export type ISODateString = string;
// export interface DefaultSession {
//   user?: {
//     name?: string | null;
//     email?: string | null;
//     image?: string | null;
//   };
//   expires: ISODateString;
// }

// interface Session extends DefaultSession {
//   user: {
//     id: string;
//     // ...other properties
//     // role: UserRole;
//   } & DefaultSession['user'];
// }

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API
 *
 * These allow you to access things like the database, the session, etc, when
 * processing a request
 *
 */
interface CreateContextOptions {
  session: any | null;
}

@Injectable()
export class TrpcService {
  constructor(private prisma: PrismaService) {}

  /**
   * This helper generates the "internals" for a tRPC context. If you need to use
   * it, you can export it from here
   *
   * Examples of things you may need it for:
   * - testing, so we dont have to mock Next.js' req/res
   * - trpc's `createSSGHelpers` where we don't have req/res
   * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
   */
  createInnerTRPCContext = (opts: CreateContextOptions) => {
    return {
      session: opts.session,
      prisma: this.prisma,
    };
  };

  /**
   * This is the actual context you'll use in your router. It will be used to
   * process every request that goes through your tRPC endpoint
   * @link https://trpc.io/docs/context
   */
  createTRPCContext = async (opts: CreateExpressContextOptions) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { req, res } = opts;

    // Get the session from the server using the unstable_getServerSession wrapper function
    // const session = await getServerSession({ req, res }) // TODO: add session for auth

    return this.createInnerTRPCContext({
      session: null,
    });
  };

  /**
   * 2. INITIALIZATION
   *
   * This is where the trpc api is initialized, connecting the context and
   * transformer
   */
  t = initTRPC
    .context<inferAsyncReturnType<typeof this.createTRPCContext>>()
    .create({
      transformer: superjson,
      errorFormatter({ shape, error }) {
        return {
          ...shape,
          data: {
            ...shape.data,
            zodError:
              error.cause instanceof ZodError ? error.cause.flatten() : null,
          },
        };
      },
    });

  /**
   * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
   *
   * These are the pieces you use to build your tRPC API. You should import these
   * a lot in the /src/server/api/routers folder
   */

  /**
   * This is how you create new routers and subrouters in your tRPC API
   * @see https://trpc.io/docs/router
   */
  createTRPCRouter = this.t.router;

  /**
   * Public (unauthed) procedure
   *
   * This is the base piece you use to build new queries and mutations on your
   * tRPC API. It does not guarantee that a user querying is authorized, but you
   * can still access user session data if they are logged in
   */
  publicProcedure = this.t.procedure;

  /**
   * Reusable middleware that enforces users are logged in before running the
   * procedure
   */
  enforceUserIsAuthed = this.t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });

  /**
   * Protected (authed) procedure
   *
   * If you want a query or mutation to ONLY be accessible to logged in users, use
   * this. It verifies the session is valid and guarantees ctx.session.user is not
   * null
   *
   * @see https://trpc.io/docs/procedures
   */
  protectedProcedure = this.t.procedure.use(this.enforceUserIsAuthed);
}
