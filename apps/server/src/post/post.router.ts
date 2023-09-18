//post.router.ts
import { INestApplication, Injectable } from '@nestjs/common';
import { PostService } from './post.service';
import { z } from 'zod';
import * as trpcExpress from '@trpc/server/adapters/express';

@Injectable()
export class PostRouter {
  constructor(private readonly postService: PostService) {}

  // Define a trpc router for Post operations
  postRouter = this.postService.router({
    // Create a new post
    createPost: this.postService.procedure
      .input(z.object({ title: z.string(), content: z.string() }))
      .mutation(async ({ input }) => {
        const createdPost = await this.postService.createPost(input);
        return createdPost;
      }),

    // Get all posts
    getAllPosts: this.postService.procedure.query(async () => {
      const posts = await this.postService.getAllPosts();
      return posts;
    }),

    // Get a specific post by ID
    getPostById: this.postService.procedure
      .input(z.string())
      .query(async ({ input }) => {
        const post = await this.postService.getPostById(input);
        return post;
      }),

    // Update a post by ID
    updatePost: this.postService.procedure
      .input(
        z.object({ id: z.string(), title: z.string(), content: z.string() }),
      )
      .mutation(async ({ input }) => {
        const updatedPost = await this.postService.updatePost(input.id, input);
        return updatedPost;
      }),

    // Delete a post by ID
    deletePost: this.postService.procedure
      .input(z.string())
      .mutation(async ({ input }) => {
        await this.postService.deletePost(input);
        return 'Post deleted successfully';
      }),
  });

  async applyMiddleware(app: INestApplication) {
    app.use(
      '/post', // Define the endpoint for Post operations
      trpcExpress.createExpressMiddleware({ router: this.postRouter }),
    );
  }
}

export type PostRouterType = PostRouter['postRouter'];
