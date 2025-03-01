'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Button } from '../ui/button'
import { ImageUpload } from '../restaurants/image-upload'
import { Restaurant, RestaurantImage } from '@prisma/client'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  description: z.string().nullable(),
  cuisine: z.string().nullable(),
  phone: z.string().nullable(),
  openTime: z.string(),
  closeTime: z.string(),
  tables: z.number().min(1, 'Must have at least 1 table'),
  maxPartySize: z.number().min(1, 'Maximum party size must be at least 1'),
  latitude: z.string().refine(val => !val || !isNaN(parseFloat(val)), {
    message: "Latitude must be a valid number"
  }).transform(val => val ? parseFloat(val) : null),
  longitude: z.string().refine(val => !val || !isNaN(parseFloat(val)), {
    message: "Longitude must be a valid number"
  }).transform(val => val ? parseFloat(val) : null),
})

// Create a schema for the form values that includes string inputs
const formSchema = schema.extend({
  latitude: z.string().optional(),
  longitude: z.string().optional(),
})

// Define types for both form input and output data
export type FormInputData = z.infer<typeof formSchema>
export type FormOutputData = z.infer<typeof schema> & { images: string[] }

type RestaurantFormProps = {
  restaurant?: Restaurant & { images: RestaurantImage[] }
  onSubmit: (data: FormOutputData) => Promise<void>
}

export function RestaurantForm({ restaurant, onSubmit }: RestaurantFormProps) {
  const [images, setImages] = useState<string[]>(restaurant?.images?.map(img => img.url) || [])
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInputData>({
    resolver: zodResolver(formSchema),
    defaultValues: restaurant ? {
      name: restaurant.name,
      address: restaurant.address,
      description: restaurant.description || '',
      cuisine: restaurant.cuisine || '',
      phone: restaurant.phone || '',
      openTime: restaurant.openTime,
      closeTime: restaurant.closeTime,
      tables: restaurant.tables,
      maxPartySize: restaurant.maxPartySize,
      latitude: restaurant.latitude ? String(restaurant.latitude) : '',
      longitude: restaurant.longitude ? String(restaurant.longitude) : '',
    } : {
      tables: 1,
      maxPartySize: 4,
      latitude: '',
      longitude: '',
    }
  })

  const handleFormSubmit = async (data: FormInputData) => {
    try {
      // Parse the schema to transform string inputs to the proper types
      const parsedData = schema.parse(data);
      
      // Include images in the submission
      await onSubmit({
        ...parsedData,
        images
      });
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) { 
      setError('Failed to save restaurant');
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
          Name
        </label>
        <input
          {...register('name')}
          className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-100"
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-2">
          Address
        </label>
        <input
          {...register('address')}
          className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-100"
        />
        {errors.address && (
          <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="cuisine" className="block text-sm font-medium text-gray-400 mb-2">
            Cuisine
          </label>
          <input
            {...register('cuisine')}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-100"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">
            Phone
          </label>
          <input
            {...register('phone')}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-100"
          />
        </div>

        <div>
          <label htmlFor="openTime" className="block text-sm font-medium text-gray-400 mb-2">
            Opening Time
          </label>
          <input
            type="time"
            {...register('openTime')}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-100"
          />
        </div>

        <div>
          <label htmlFor="closeTime" className="block text-sm font-medium text-gray-400 mb-2">
            Closing Time
          </label>
          <input
            type="time"
            {...register('closeTime')}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="tables" className="block text-sm font-medium text-gray-400 mb-2">
            Number of Tables
          </label>
          <input
            type="number"
            {...register('tables', { valueAsNumber: true })}
            min="1"
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-100"
          />
          {errors.tables && (
            <p className="text-sm text-red-500 mt-1">{errors.tables.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="maxPartySize" className="block text-sm font-medium text-gray-400 mb-2">
            Max Party Size per Table
          </label>
          <input
            type="number"
            {...register('maxPartySize', { valueAsNumber: true })}
            min="1"
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-100"
          />
          {errors.maxPartySize && (
            <p className="text-sm text-red-500 mt-1">{errors.maxPartySize.message}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-400 mb-2">
            Latitude
          </label>
          <input
            type="text"
            {...register('latitude')}
            placeholder="e.g., 37.7749"
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-100"
          />
          {errors.latitude && (
            <p className="text-sm text-red-500 mt-1">{errors.latitude.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-400 mb-2">
            Longitude
          </label>
          <input
            type="text"
            {...register('longitude')}
            placeholder="e.g., -122.4194"
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-100"
          />
          {errors.longitude && (
            <p className="text-sm text-red-500 mt-1">{errors.longitude.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Images
        </label>
        <ImageUpload 
          maxImages={5}
          initialImages={images}
          onChange={setImages} // Add onChange handler
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : restaurant ? 'Update Restaurant' : 'Create Restaurant'}
      </Button>
    </form>
  )
}
