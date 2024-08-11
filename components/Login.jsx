'use client'

import React, { useEffect, useState } from 'react'
import { signIn, useSession, getProviders } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'


const Login = () => {

  const { data: session } = useSession(); 
  const [providers, setProviders] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    }
    setUpProviders();
  }, []);

  useEffect(() => {
    if (session?.user) {
      router.push('/home');
    }
  }, [session, router]);

  if (session?.user) {
    return null; // when user is already authenticated ; it avoids flickers
  }

  return (
    <nav className='flex items-center justify-center h-screen'>
      <ul>
        {providers && Object.values(providers).map((provider) => (
          <li key={provider.name}>
            <Image
              src = "/assets/images/GooglDrive.png"
              width = {350}
              height = {350}
              alt = "Drive Image"
            />
            <div className="flex flex-col items-center gap-2  " >
              <h1 className='text-4xl'>Google Drive</h1>
              <button
                onClick={() => signIn(provider.id)}
                className='btn bg-blue-500 text-white py-2 px-4 w-28 rounded-md '
              >
                Sign in
              </button>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Login;
