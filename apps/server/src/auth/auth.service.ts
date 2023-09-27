// auth/auth.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async validateUser(username: string, password: string): Promise<any> {
    const mockUsers = [
      { id: 1, username: 'user1', password: 'password1' },
      { id: 2, username: 'user2', password: 'password2' },
    ];

    const user = mockUsers.find((u) => u.username === username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }
}
