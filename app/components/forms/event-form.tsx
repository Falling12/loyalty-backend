'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState, useEffect, useCallback } from 'react'
import { EventFormData } from '@/app/actions/event'
import { Event, EventImage } from '@prisma/client'
import { ImageUpload } from '../facilities/image-upload'

// Update the schema to use array of category IDs
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().nullable(),
  date: z.coerce.date().refine(date => date > new Date(), {
    message: 'Date must be in the future'
  }),
  categoryIds: z.array(z.string()).min(1, 'At least one category is required')
})

type FormData = z.infer<typeof schema>

type EventFormProps = {
  event?: Event & { 
    categories?: { categoryId: string }[],
    images?: EventImage[]
  }
  onSubmit: (data: EventFormData) => Promise<void>
}

export function EventForm({ event, onSubmit }: EventFormProps) {
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([])
  const [images, setImages] = useState<string[]>(event?.images?.map(img => img.url) || [])
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  
  // Format a date as YYYY-MM-DD for the input
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  }
  
  const defaultDate = event ? new Date(event.date) : new Date();
  if (!event) {
    defaultDate.setDate(defaultDate.getDate() + 1); // Set to tomorrow by default to pass validation
  }
  
  // Get category IDs from event if it exists
  const defaultCategoryIds = event?.categories?.map(c => c.categoryId) || [];
  
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: event ? {
      name: event.name,
      description: event.description || '',
      date: new Date(event.date),
      categoryIds: defaultCategoryIds
    } : {
      name: '',
      description: '',
      date: defaultDate,
      categoryIds: []
    }
  })

  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch('/api/event-categories')
      const data = await response.json()
      setCategories(data)
    }
    fetchCategories()
  }, [])

  const handleImagesChange = useCallback((newImages: string[]) => {
    setImages(newImages);
  }, []);

  const handleUploadStatusChange = useCallback((status: boolean) => {
    setIsUploadingImages(status);
  }, []);

  const handleFormSubmit = async (data: FormData) => {
    setError('')
    try {
      if (isUploadingImages) {
        setError('Please wait for images to finish uploading');
        return;
      }
      
      onSubmit({
        name: data.name,
        description: data.description!,
        date: new Date(data.date),
        categoryIds: data.categoryIds,
        images
      })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      setError('Failed to save event')
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

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">Date</label>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <input
              type="date"
              className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500"
              value={formatDateForInput(field.value)}
              onChange={(e) => {
                field.onChange(e.target.value ? new Date(e.target.value) : null);
              }}
            />
          )}
        />
        {errors.date && (
          <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">Categories</label>
        <Controller
          name="categoryIds"
          control={control}
          render={({ field }) => (
            <select
              multiple
              className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500"
              value={field.value}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions);
                field.onChange(options.map(option => option.value));
              }}
              onBlur={field.onBlur}
              size={4} // Show 4 options at once
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        />
        <p className="text-sm text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple categories</p>
        {errors.categoryIds && (
          <p className="text-sm text-red-500 mt-1">{errors.categoryIds.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">Images</label>
        <ImageUpload
          maxImages={5}
          initialImages={images}
          onChange={handleImagesChange}
          onUploadStatusChange={handleUploadStatusChange}
        />
        <p className="text-sm text-gray-400 mt-1">Upload up to 5 images for this event (4MB max per image)</p>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || isUploadingImages}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save Event'}
      </button>
    </form>
  )
}
