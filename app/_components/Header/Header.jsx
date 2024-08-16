"use client"
import React, { useState } from 'react'
import { GiSpaceShuttle } from "react-icons/gi";
import { FaQuestion } from "react-icons/fa";
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  const [showDialog, setShowDialog] = useState(false);

  const handleDialog = () => {
    setShowDialog(!showDialog);
  };

  return (
    
      <div className='flex  w-full  justify-between leading-[60px] border-2  px-8 bg-white dark:bg-gray-800 text-black dark:text-white sticky  top-0 z-10 cursor-pointer'>
        <div className='flex gap-2 items-center'>
          <div><GiSpaceShuttle className='md:text-[35px] sm:text-sm  text-blue-400 ' /></div>
          <div className='md:text-[16px] sm:text-[12px]'>OpenSpace - Admin</div>                  
        </div>
        <div className='flex items-center gap-2 relative' onClick={handleDialog}>
          <p><FaQuestion /></p>
          <div className='bg-slate-400 rounded-full p-1'>
            <Image src='/avatar.png' width={35} height={35} alt="Profile" />
          </div>    
          {showDialog && (
          <div className='absolute top-12 right-0 w-[340px]  z-[-10] bg-white shadow-lg border py-2 border-gray-200 rounded-md px-4'>
            <div className=' py-4'>
              <p className='font-semibold leading-tight'>Muhammad Saleem</p>
              <p className='text-gray-500 leading-tight'>saleem@peritus.ae</p>
            </div>
            <hr className='border-t border-gray-300 ' />


            <div className='flex justify-between text-gray-500 py-3 px-1 text-sm'>
              <Link href="/Profile" className='hover:underline leading-tight uppercase '>View Profile</Link>
              <Link href="/signout" className='hover:underline leading-tight uppercase'>Sign Out</Link>
            </div>
          </div>
        )}
        </div>      
      </div>
    
  )
}

export default Header;

