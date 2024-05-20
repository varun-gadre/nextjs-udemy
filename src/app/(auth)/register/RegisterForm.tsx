'use client';
import { registerUser } from '@/app/actions/authActions';
import { RegisterSchema, registerSchema } from '@/lib/schemas/RegisterSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { GiPadlock } from 'react-icons/gi';
import { ZodIssue } from 'zod';


export default function RegisterForm() {
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  });
  const onSubmit = async (data: RegisterSchema) => {
    const result = await registerUser(data);
    if (result.status === 'success') {
      console.log('User registered successfully!');
    } else {
      if (Array.isArray(result.error)) {
        result.error.forEach((e: ZodIssue) => {
          const fieldName = e.path.join('.') as 'email' | 'name' | 'password';

          setError(fieldName, { message: e.message })
        });
      } else {
        setError("root.serverError", { message: result.error })
      }
    }
  };
  return (
    <Card className='mx-auto w-2/5'>
      <CardHeader className='flex flex-col items-center justify-center'>
        <div className='flex flex-col items-center gap-2 text-secondary'>
          <div className='flex flex-row items-center gap-3'>
            <GiPadlock size={30} />
            <h1 className='text-2xl font-semibold'>Register</h1>
          </div>
          <p className='text-neutral-500'>Welcome to NextMatch</p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4'>
            <Input
              defaultValue=''
              label='Name'
              variant='bordered'
              {...register('name')}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />
            <Input
              defaultValue=''
              label='Email'
              variant='bordered'
              {...register('email')}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message as string}
            />
            <Input
              defaultValue=''
              label='Password'
              type='password'
              variant='bordered'
              {...register('password')}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message as string}
            />
            {errors.root?.serverError && (
              <p className='text-danger text-sm'>{errors.root?.serverError.message}</p>
            )}
            <Button
              isLoading={isSubmitting}
              fullWidth
              isDisabled={!isValid}
              color='secondary'
              type='submit'
            >
              Register
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
