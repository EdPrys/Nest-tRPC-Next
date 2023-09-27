import { Strategy } from 'passport-local';

export class LocalStrategy extends Strategy {
  constructor() {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  } 
  async validate(username: string, password: string): Promise<any> {
    const user = users.find((u) => u.username === username);
    if (user && user.password === password) {
      return user; 
        }
     null; 
   }
}