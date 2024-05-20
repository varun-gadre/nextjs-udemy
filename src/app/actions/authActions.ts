'use server';

import { prisma } from '@/lib/prisma';
import { RegisterSchema, registerSchema } from '@/lib/schemas/RegisterSchema';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
