import { auth, signOut } from '@/auth';
import { Button, Link } from '@nextui-org/react';
import { FaRegSmile } from 'react-icons/fa';

export default async function Home() {
    const session = await auth();
    return (
        <div className='container'>
            <h1 className='text-3xl font-semibold'>Hello app!</h1>
            <h3 className='text-2xl font-semibold'>User Session Data
                {session ? (
                    <div>
                        <pre>{JSON.stringify(session, null, 2)}</pre>
                        <form action={async () => {
                            'use server';
                            await signOut()
                        }}>
                            <Button
                                type='submit'
                                color='primary'
                                variant='bordered'
                                startContent={<FaRegSmile size={20} />}
                            >
                                Sign Out
                            </Button>
                        </form>

                    </div>
                ) : (
                    <div>
                        <p>Not authenticated, please sign in</p>
                    </div>
                )}
            </h3>

        </div>
    );
}
