'use client'

import { NavbarItem } from '@nextui-org/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type NavLinkProps = {
    href: string;
    label: string;
};

export default function NavLink({ href, label }: NavLinkProps) {
    const pathname = usePathname();
    return (
        <NavbarItem isActive={pathname === href} href={href} as={Link}>
            {label}
        </NavbarItem>
    );
}
