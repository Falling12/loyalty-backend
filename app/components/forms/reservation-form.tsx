'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Reservation, User, Restaurant } from '@prisma/client'
import { useRouter } from 'next/navigation'

const schema = z.object({
  userId: z.string().min(1, 'Customer is required'),
  restaurantId: z.string().min(1, 'Restaurant is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  partySize: z.number().min(1, 'Party size must be at least 1'),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']),
})

type FormData = z.infer<typeof schema>

type ReservationFormProps = {
  users: User[]
  restaurants: Restaurant[]
  reservation?: Reservation & {
    user: User
    restaurant: Restaurant
  }
  onSubmit: (data: FormData) => Promise<void>
  allowCustomerChange?: boolean
  allowRestaurantChange?: boolean
}

export function ReservationForm({ 
  users, 
  restaurants, 
  reservation, 
  onSubmit,
  allowCustomerChange = true,
  allowRestaurantChange = true,
}: ReservationFormProps) {
  const router = useRouter()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: reservation ? {
      userId: reservation.userId,
      restaurantId: reservation.restaurantId,
      date: reservation.date.toISOString().split('T')[0],
      time: reservation.time,
      partySize: reservation.partySize,
      status: reservation.status as 'PENDING' | 'CONFIRMED' | 'CANCELLED',
    } : undefined
  })

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data)
      router.push('/reservations')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save reservation')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {allowCustomerChange ? (
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-400 mb-2">
            Customer
          </label>
          <select
            {...register('userId')}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-100"
          >
            <option value="">Select a customer</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
          {errors.userId && (
            <p className="text-sm text-red-500 mt-1">{errors.userId.message}</p>
          )}
        </div>
      ) : reservation ? (
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Customer
          </label>
          <p className="text-gray-300">{reservation.user.name}</p>
          <input type="hidden" {...register('userId')} />
        </div>
      ) : null}

      {allowRestaurantChange ? (
        <div>
          <label htmlFor="restaurantId" className="block text-sm font-medium text-gray-400 mb-2">
            Restaurant
          </label>
          <select
            {...register('restaurantId')}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-100"
          >
            <option value="">Select a restaurant</option>
            {restaurants.map(restaurant => (
              <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
            ))}
          </select>
          {errors.restaurantId && (
            <p className="text-sm text-red-500 mt-1">{errors.restaurantId.message}</p>
          )}
        </div>
      ) : reservation ? (
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Restaurant
          </label>
          <p className="text-gray-300">{reservation.restaurant.name}</p>
          <input type="hidden" {...register('restaurantId')} />
        </div>
      ) : null}

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-400 mb-2">
          Date
        </label>
        <input
          type="date"
          {...register('date')}
          className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-100"
        />
        {errors.date && (
          <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-400 mb-2">
          Time
        </label>
        <input
          type="time"
          {...register('time')}
          className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-100"
        />
        {errors.time && (
          <p className="text-sm text-red-500 mt-1">{errors.time.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="partySize" className="block text-sm font-medium text-gray-400 mb-2">
          Party Size
        </label>
        <input
          type="number"
          {...register('partySize', { valueAsNumber: true })}
          min="1"
          className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-100"
        />
        {errors.partySize && (
          <p className="text-sm text-red-500 mt-1">{errors.partySize.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-400 mb-2">
          Status
        </label>
        <select
          {...register('status')}
          className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-100"
        >
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        {errors.status && (
          <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : reservation ? 'Update Reservation' : 'Create Reservation'}
      </Button>
    </form>
  )
}
