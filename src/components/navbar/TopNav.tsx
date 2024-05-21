
import { Button, Navbar, NavbarBrand, NavbarContent } from '@nextui-org/react';
import Link from 'next/link';
import React, { Fragment } from 'react';
import { GiMatchTip } from 'react-icons/gi';
import NavLink from './NavLink';
import { auth } from '@/auth';
import UserMenu from './UserMenu';

async function TopNav() {
    const session = await auth();
    return (
        <Navbar
            maxWidth='xl'
            classNames={{
                item: [
                    'text-xl',
                    'text-white',
                    'uppercase',
                    'data-[active=true]:text-yellow-200',
                ],
            }}
            className='bg-gradient-to-r from-purple-400 to-purple-900'
        >
            <NavbarBrand as={Link} href='/'>
                <GiMatchTip className='text-grey-200' size={40} />
                <div className='flex text-3xl font-bold'>
                    <span className='text-grey-900'>Next</span>
                    <span className='text-grey-200'>Match</span>
                </div>
            </NavbarBrand>

            <NavbarContent justify='center'>
                <NavLink label='Matches' href='/members' />
                <NavLink label='Lists' href='/lists' />
                <NavLink label='Messages' href='/messages' />
            </NavbarContent>
            <NavbarContent justify='end'>
                {session?.user ? (
                    <UserMenu user={session.user} />
                ) : <Fragment>
                    <Button
                        as={Link}
                        href='/login'
                        variant='bordered'
                        className='text-white'
                    >
                        Login
                    </Button>
                    <Button
                        as={Link}
                        href='/register'
                        variant='bordered'
                        className='text-white'
                    >
                        Register
                    </Button>

                </Fragment>}

            </NavbarContent>
        </Navbar>
    );
}

export default TopNav;
