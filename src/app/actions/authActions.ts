'use server';

import { signIn } from '@/auth';
import { prisma } from '@/lib/prisma';
import { LoginSchema } from '@/lib/schemas/LoginSchema';
import { RegisterSchema, registerSchema } from '@/lib/schemas/RegisterSchema';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';

export async function signInUser(
    data: LoginSchema
): Promise<ActionResult<string>> {
    try {
        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        });
        console.log(result);
        return { status: 'success', data: 'Logged in' };
    } catch (err) {
        if (err instanceof AuthError) {
            switch (err.type) {
                case 'CredentialsSignin':
                    return { status: 'error', error: 'invalid credentials' };
                default:
                    return { status: 'error', error: 'something went wrong' };
            }
        } else {
            return {
                status: 'error',
                error: 'Definitly not an AuthError! s Something went wrong',
            };
        }
    }
}

export async function registerUser(
    data: RegisterSchema
): Promise<ActionResult<User>> {
    try {
        const validated = registerSchema.safeParse(data);
        if (!validated.success) {
            return { status: 'error', error: validated.error.errors };
        }

        const { name, email, password } = validated.data;
        const passwordHash = await bcrypt.hash(password, 10);
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (existingUser)
            return { status: 'error', error: 'User already exists' };

        const resp = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
            },
        });
        return { status: 'success', data: resp };
    } catch (err) {
        console.log(err);
        return {
            status: 'error',
            error: 'Something went wrong, check server logs',
        };
    }
}

export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
}
