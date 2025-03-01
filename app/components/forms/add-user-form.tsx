'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createUser } from '../../actions/user'
import { useState } from 'react'

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['user', 'admin']).default('user')
})

type FormData = z.infer<typeof schema>

export function AddUserForm({ onSuccess }: { onSuccess: () => void }) {
    const [error, setError] = useState('')
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    const onSubmit = async (data: FormData) => {
        try {
            await createUser(data)
            onSuccess()
            
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) { 
            setError('Failed to create user')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Name</label>
                <input
                    {...register('name')}
                    className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500"
                />
                {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
                <input
                    type="email"
                    {...register('email')}
                    className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500"
                />
                {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Password</label>
                <input
                    type="password"
                    {...register('password')}
                    className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500"
                />
                {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Role</label>
                <select
                    {...register('role')}
                    className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500"
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
                {isSubmitting ? 'Creating...' : 'Create User'}
            </button>
        </form>
    )
}
