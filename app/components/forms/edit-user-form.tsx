'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateUser } from '../../actions/user'
import { useState } from 'react'
import { User } from '../../types/auth'

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    role: z.enum(['user', 'admin']).default('user'),
    displayName: z.string().nullable(),
    bio: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    location: z.string().nullable(),
    balance: z.number().min(0, 'Balance must be positive').default(0),
})

type FormData = z.infer<typeof schema>

export function EditUserForm({ user, onSuccess }: { user: User, onSuccess: () => void }) {
    const [error, setError] = useState('')
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: user.name,
            email: user.email,
            role: user.role as 'user' | 'admin',
            displayName: user.displayName || '',
            bio: user.bio || '',
            phoneNumber: user.phoneNumber || '',
            location: user.location || '',
            balance: user.balance || 0,
        }
    })

    const onSubmit = async (data: FormData) => {
        try {
            await updateUser(user.id, data)
            onSuccess()
            
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) { 
            setError('Failed to update user')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Display Name</label>
                <input
                    {...register('displayName')}
                    className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Bio</label>
                <textarea
                    {...register('bio')}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">Phone Number</label>
                    <input
                        {...register('phoneNumber')}
                        className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">Location</label>
                    <input
                        {...register('location')}
                        className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Balance</label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('balance', { valueAsNumber: true })}
                    className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500"
                />
                {errors.balance && (
                    <p className="text-sm text-red-500 mt-1">{errors.balance.message}</p>
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
                {isSubmitting ? 'Updating...' : 'Update User'}
            </button>
        </form>
    )
}
