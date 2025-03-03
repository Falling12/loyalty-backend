"use client"

import { authClient } from '@/lib/client'
import { useRouter } from 'next/navigation'
import React from 'react'

const LogoutButton = () => {
    const router = useRouter()
    const handleLogout = async () => {
        await authClient.signOut()

        router.push('/login')
    }

    return (
        <button className='bg-red-500 text-white px-4 py-2 rounded font-bold' onClick={handleLogout}>
            Logout
        </button>
    )
}

export default LogoutButton