'use client';

import Link from 'next/link';
import UserMenu from './UserMenu';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

export default function AuthButtons() {
  const router = useRouter()
  const user = localStorage.getItem("user")
  const [userData, setUserData] = useState<{
    username: string;
    email:string
  }>()
  const userRef = useRef(user)

  useEffect(() => {
    if (user !== userRef.current) {
      userRef.current = user
      if (user !== "" && user) {
        setUserData(JSON.parse(user))
      }
    }
  }, [user])

  // const { data: session, status } = useSession();

  // if (status === 'loading') {
  //   return <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>; // Loading state
  // }

  // if (status === 'authenticated') {
  //   return <UserMenu />;
  // }

  // status === 'unauthenticated'
  return (
    <>
    {
      !userData ?  <div className="flex items-center space-x-4">
      <Link href="/login" className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-700 transition">
        Sign In
      </Link>
      <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Sign Up
      </Link>
      </div> :<div className="flex items-center space-x-4">
      <span className="text-gray-700 dark:text-gray-200 text-sm">
        {userData?.email || userData?.username}
      </span>
      <button
        onClick={() => {
          localStorage.removeItem("user")
          window.location.reload()
          router.push("/")
        }}
        className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
    }
   
    </>
  );
} 