import { prisma } from '@/lib/auth'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { updateRestaurant } from '../../../actions/restaurant'
import { RestaurantForm } from '../../../components/forms/restaurant-form'
// Import both types
import type { RestaurantFormData } from '../../../actions/restaurant'
import type { FormOutputData } from '../../../components/forms/restaurant-form'

export default async function EditRestaurantPage({ 
  params
}: { 
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: { images: true }
  })

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-800 p-6">
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <p className="text-gray-400">Restaurant not found</p>
        </div>
      </div>
    )
  }

  // Update the parameter type to match what RestaurantForm component expects (FormOutputData)
  const handleUpdate = async (formData: FormOutputData) => {
    'use server'
    
    // Create a properly typed object to pass to updateRestaurant
    const restaurantData: RestaurantFormData = {
      name: formData.name,
      address: formData.address,
      // Convert nullable fields to non-nullable if needed
      description: formData.description || '', // Handle null case
      cuisine: formData.cuisine || '', // Handle null case
      phone: formData.phone || '', // Handle null case
      openTime: formData.openTime,
      closeTime: formData.closeTime,
      tables: formData.tables,
      maxPartySize: formData.maxPartySize,
      // Handle potentially null coordinates
      longitude: formData.longitude,
      latitude: formData.latitude,
      images: formData.images || [] // Add the missing images property
    }
    
    await updateRestaurant(id, restaurantData)
  }

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="mb-6">
        <Link 
          href={`/restaurants/${id}`}
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Restaurant
        </Link>
      </div>

      <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">Edit Restaurant</h1>
        <RestaurantForm 
          restaurant={restaurant}
          onSubmit={handleUpdate}
        />
      </div>
    </div>
  )
}
