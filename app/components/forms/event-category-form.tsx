'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { EventCategoryFormData } from '@/app/actions/event'
import { EventCategory } from '@prisma/client'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters')
})

type FormData = z.infer<typeof schema>

type EventCategoryFormProps = {
  eventCategory?: EventCategory
  onSubmit: (data: EventCategoryFormData) => Promise<void>
}

export function EventCategoryForm({ onSubmit, eventCategory }: EventCategoryFormProps) {
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: eventCategory ? {
      name: eventCategory.name,
    } : {
      name: '',
    }
  })

  const handleFormSubmit = async (data: FormData) => {
    setError('')
    try {
      await onSubmit(data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      setError('Failed to save event category')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save Event Category'}
      </button>
    </form>
  )
}
