//post.service.ts
import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaClient) {}

  async createPost(input: { title: string; content: string }) {
    return this.prisma.post.create({
      data: input,
    });
  }

  async getAllPosts() {
    return this.prisma.post.findMany();
  }

  async getPostById(id: string) {
    return this.prisma.post.findUnique({
      where: {
        id,
      },
    });
  }

  async updatePost(id: string, input: { title: string; content: string }) {
    return this.prisma.post.update({
      where: {
        id,
      },
      data: input,
    });
  }

  async deletePost(id: string) {
    return this.prisma.post.delete({
      where: {
        id,
      },
    });
  }
}
