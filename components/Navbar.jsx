'use client'


import React, { useEffect, useState } from 'react'
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';
import { useRouter } from 'next/navigation';


const Navbar = () => {

  const {data:session} = useSession(); 
  const [providers, setProviders] = useState(null);
  const router = useRouter();

  useEffect(() => {
      const setUpProviders = async () => {
          const response = await getProviders();
          setProviders(response);
      }
      setUpProviders();
  }, []);

  return (
    <nav className='flex flex-row justify-center align-middle'>
      <ul>
        {session?.user?(
          <>
            <button
              onClick={signOut}
            >
              SignOut
            </button>
          </>
        ) : (
          <>
            {providers && Object.values(providers).map((provider)=>(

              <li key={provider.name}>
                <button
                  onClick={() => signIn(provider.id)}
                >
                  Sign In
                </button>
              </li>
            ))}
          </>
        )
        }
      </ul>
    </nav>
    )
}

export default Navbar