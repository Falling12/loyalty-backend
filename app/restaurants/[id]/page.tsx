import { prisma } from '@/lib/auth'
import Link from 'next/link'
import { ArrowLeft, Edit, MapPin, Clock, Phone, ChefHat, Users } from 'lucide-react'
import { RestaurantMap } from '../../components/restaurant-map'
import Image from 'next/image'

export default async function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: id },
    include: { images: { orderBy: { order: 'asc' } } }
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

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="mb-6 flex justify-between items-center">
        <Link
          href="/restaurants"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Restaurants
        </Link>
        
        <Link
          href={`/restaurants/${id}/edit`}
          className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Restaurant
        </Link>
      </div>

      <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg overflow-hidden">
        {restaurant.images.length > 0 && (
          <div className="relative h-[300px] w-full">
            <Image 
              src={restaurant.images[0].url}
              alt={restaurant.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-4">{restaurant.name}</h1>
          
          <div className="flex flex-wrap items-center text-gray-400 mb-4 gap-y-2">
            <div className="flex items-center mr-6">
              <MapPin className="w-4 h-4 mr-2" />
              {restaurant.address}
            </div>
            <div className="flex items-center mr-6">
              <Clock className="w-4 h-4 mr-2" />
              {restaurant.openTime} - {restaurant.closeTime}
            </div>
            {restaurant.phone && (
              <div className="flex items-center mr-6">
                <Phone className="w-4 h-4 mr-2" />
                {restaurant.phone}
              </div>
            )}
            {restaurant.cuisine && (
              <div className="flex items-center mr-6">
                <ChefHat className="w-4 h-4 mr-2" />
                {restaurant.cuisine}
              </div>
            )}
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              {restaurant.tables} tables, max {restaurant.maxPartySize} per table
            </div>
          </div>
          
          {restaurant.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-200 mb-2">About</h2>
              <p className="text-gray-400">{restaurant.description}</p>
            </div>
          )}

          {(restaurant.latitude && restaurant.longitude) && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-200 mb-3">Location</h2>
              <RestaurantMap 
                latitude={restaurant.latitude} 
                longitude={restaurant.longitude}
                name={restaurant.name}
                className="h-[300px] w-full rounded-md overflow-hidden"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
