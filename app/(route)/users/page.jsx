"use client"
import React from 'react'
import FormComp from './_Components/FormComp'
import { useSearchParams } from 'next/navigation';


const users = () => {
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');  

     console.log("user",userId)
     
    return (
        <div>
            <FormComp/>
        </div>
    )
}

export default users
