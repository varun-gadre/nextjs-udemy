import { Button, Link } from '@nextui-org/react';
import { FaRegSmile } from 'react-icons/fa';

export default function Home() {
  return (
    <div className='container'>
      <h1 className='text-3xl font-semibold text-red-500'>Hello app!</h1>
      <Button
        href='/members'
        as={Link}
        color='primary'
        variant='bordered'
        startContent={<FaRegSmile size={20} />}
      >
        click me
      </Button>
    </div>
  );
}
