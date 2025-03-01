'use client'

import React, { useState } from 'react'
import { authClient } from '@/lib/client'
import { createFirstUser } from '../actions/user'
import { useRouter } from 'next/navigation'

export default function RegisterFirstAdmin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setError('')
        setLoading(true)

        try {
            await createFirstUser({ email, password, role: 'admin', name: name })

            // Sign in automatically after registration
            await authClient.signIn.email({ email, password })
            // Redirect will be handled by better-auth
            
            router.push('/')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setError('Failed to register admin user')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <h2 className="text-3xl font-bold text-center text-white">Create Admin Account</h2>
            <p className="text-center text-gray-400">Set up your first administrator account</p>
            {error && <div className="text-red-400 text-center">{error}</div>}
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white p-2 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white p-2 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white p-2 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white p-2 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {loading ? 'Creating Account...' : 'Create Admin Account'}
                </button>
            </form>
        </>
    )
}
