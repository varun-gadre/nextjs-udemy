import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { prisma } from './lib/prisma';
import credentials from 'next-auth/providers/credentials';
import { loginSchema } from './lib/schemas/LoginSchema';
import { getUserByEmail } from './app/actions/authActions';
import bcrypt from 'bcryptjs';

export const { auth, handlers, signIn, signOut } = NextAuth({
    callbacks: {
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.userId = token.sub;
            }
            return session;
        },
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        credentials({
            name: 'credentials',
            async authorize(creds) {
                const validated = loginSchema.safeParse(creds);
                if (validated.success) {
                    const { email, password } = validated.data;
                    const user = await getUserByEmail(email);
                    if (!user) {
                        return null;
                    }
                    const isPwdCorrect = await bcrypt.compare(
                        password,
                        user.passwordHash
                    );
                    if (!isPwdCorrect) {
                        return null;
                    }
                    return user;
                }
                return null;
            },
        }),
    ],
    session: { strategy: 'jwt' },
});
