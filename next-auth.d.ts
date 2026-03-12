import NextAuth from 'next-auth';
import { UserT } from './types/user.type';


declare module 'next-auth' {
  interface Session {
    user: UserT;
  }

  interface User extends ExtendedUser {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: ExtendedUser;
  }
}
