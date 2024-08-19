'use client';

import { signOut, useSession } from 'next-auth/react';
import { User } from 'next-auth';
import Link from 'next/link';
import { Button } from '@react-email/components';

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <div className="bg-orange-500 min-w-full">
      <nav className="container mx-auto flex flex-col md:flex-row justify-evenly items-center p-4">
        <a href="/">
          <span className="text-3xl sm:text-xl font-bold text-white border-b-4 border-double border-white pb-2" >
            Mystry Messages
          </span>
        </a>
        <div className="flex gap-4 items-center mt-5 md:mt-0 ">
          {session ? (
            <div className="flex items-center space-x-2 md:space-x-4">
              <span className="text-lg font-medium rounded-full px-4 py-2 border-2 border-white text-white hover:bg-green-500 hover:text-white cursor-pointer transition">
                Welcome, {user.username || user.email}
              </span>
              <span
                className="text-lg font-medium rounded-full px-4 py-2 border-2 border-white text-white hover:bg-red-500 hover:text-white cursor-pointer transition"
                onClick={() => signOut()}
              >
                Log Out
              </span>
            </div>
          ) : (
            <Link href="/sign-in">
              <Button className="text-lg font-medium rounded-full px-4 py-2 border-2 border-white text-white hover:bg-green-500 hover:text-white transition">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
