'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState, useCallback } from 'react'
import { Button } from '../ui/button'
import { ImageUpload } from '../facilities/image-upload'
import { Facility, FacilityImage } from '@prisma/client'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  description: z.string().nullable(),
  phone: z.string().nullable(),
  openTime: z.string(),
  closeTime: z.string(),
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

type FacilityFormProps = {
  facility?: Facility & { images: FacilityImage[] }
  onSubmit: (data: FormOutputData) => Promise<void>
}

export function FacilityForm({ facility, onSubmit }: FacilityFormProps) {
  const [images, setImages] = useState<string[]>(facility?.images?.map(img => img.url) || [])
  const [error, setError] = useState('')
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInputData>({
    resolver: zodResolver(formSchema),
    defaultValues: facility ? {
      name: facility.name,
      address: facility.address,
      description: facility.description || '',
      phone: facility.phone || '',
      openTime: facility.openTime,
      closeTime: facility.closeTime,
      latitude: facility.latitude ? String(facility.latitude) : '',
      longitude: facility.longitude ? String(facility.longitude) : '',
    } : {
      name: '',
      address: '',
      description: '',
      phone: '',
      openTime: '09:00',
      closeTime: '22:00',
      latitude: '',
      longitude: '',
    }
  })

  const handleFormSubmit = async (data: FormInputData) => {
    console.log("Form submission attempted", { data, isUploadingImages });
    setError('');
    
    try {
      if (isUploadingImages) {
        setError('Please wait for images to finish uploading');
        return;
      }

      // Parse the schema to transform string inputs to the proper types
      const parsedData = schema.parse(data);
      console.log("Data parsed successfully", parsedData);

      // Include images in the submission
      console.log("Submitting with images:", images);
      await onSubmit({
        ...parsedData,
        images
      });
      console.log("Submission completed");

    } catch (error) {
      console.error("Form submission error:", error);
      setError('Failed to save facility');
    }
  }

  const handleImagesChange = useCallback((newImages: string[]) => {
    console.log("Images changed:", newImages);
    setImages(newImages);
  }, []);

  const handleUploadStatusChange = useCallback((status: boolean) => {
    console.log("Upload status changed:", status);
    setIsUploadingImages(status);
  }, []);

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

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">
          Phone
        </label>
        <input
          {...register('phone')}
          className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          onChange={handleImagesChange}
          onUploadStatusChange={handleUploadStatusChange}
        />
        <p className="text-sm text-gray-400 mt-1">Upload up to 5 images of your facility (4MB max per image)</p>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      <div className="mt-6">
        <Button 
          type="submit" 
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md" 
          disabled={isSubmitting || isUploadingImages}
        >
          {isSubmitting ? 'Saving...' : facility ? 'Update Facility' : 'Create Facility'}
        </Button>
      </div>
    </form>
  )
}
