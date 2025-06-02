// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { comparePasswords } from "@/lib/hash";
import type { DefaultSession, DefaultUser } from "next-auth";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
  }
}

// ✅ Extract and export authOptions
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ username: credentials?.username });
        if (!user) return null;

        const isValid = await comparePasswords(
          credentials!.password,
          user.password
        );
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.username,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = String(token.id);
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// ✅ Use the exported options for the handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };



// // src/app/api/auth/[...nextauth]/route.ts
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import dbConnect from "@/lib/db";
// import User from "@/models/User";
// import { comparePasswords } from "@/lib/hash";

// // Extend NextAuth types to include id and role
// import type { DefaultSession, DefaultUser } from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       role: string;
//     } & DefaultSession["user"];
//   }
//   interface User extends DefaultUser {
//     id: string;
//     role: string;
//   }
// }

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: { label: "Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         await dbConnect();

//         const user = await User.findOne({ username: credentials?.username });
//         if (!user) return null;

//         const isValid = await comparePasswords(
//           credentials!.password,
//           user.password
//         );
//         if (!isValid) return null;

//         return {
//           id: user._id.toString(),
//           name: user.username,
//           role: user.role,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token && session.user) {
//         session.user.id = String(token.id);
//         session.user.role = token.role as string;
//       }
//       return session;
//     },
//   },
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     signIn: "/login",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// });

// export { handler as GET, handler as POST };


// import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import dbConnect from '@/lib/db';
// import User from '@/models/User';
// import { verifyPassword } from '@/lib/hash';

// const handler = NextAuth({
//   session: {
//     strategy: 'jwt',
//   },
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         username: { label: 'Username', type: 'text' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         await dbConnect();

//         const user = await User.findOne({ username: credentials.username });
//         if (!user) throw new Error('Invalid username or password');

//         const isValid = await verifyPassword(credentials.password, user.password);
//         if (!isValid) throw new Error('Invalid username or password');

//         return {
//           id: user._id,
//           username: user.username,
//           role: user.role
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role;
//         token.username = user.username;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user.username = token.username;
//       session.user.role = token.role;
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// });

// export { handler as GET, handler as POST };
