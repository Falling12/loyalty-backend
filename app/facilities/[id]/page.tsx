import { prisma } from '@/lib/auth'
import Link from 'next/link'
import { ArrowLeft, Edit, MapPin, Clock, Phone, ChefHat, Users } from 'lucide-react'
import { RestaurantMap } from '../../components/facility-map'
import Image from 'next/image'

export const dynamicParams = true
export const revalidate = 60

export async function generateStaticParams() {
  const facilitys = await prisma.facility.findMany({
    select: { id: true }
  })

  return facilitys.map(facility => ({
    id: facility.id
  }))
}

export default async function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const facility = await prisma.facility.findUnique({
    where: { id: id },
    include: { images: { orderBy: { order: 'asc' } } }
  })

  if (!facility) {
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
          href="/facilitys"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Restaurants
        </Link>
        
        <Link
          href={`/facilitys/${id}/edit`}
          className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Restaurant
        </Link>
      </div>

      <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg overflow-hidden">
        {facility.images.length > 0 && (
          <div className="relative h-[300px] w-full">
            <Image 
              src={facility.images[0].url}
              alt={facility.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-4">{facility.name}</h1>
          
          <div className="flex flex-wrap items-center text-gray-400 mb-4 gap-y-2">
            <div className="flex items-center mr-6">
              <MapPin className="w-4 h-4 mr-2" />
              {facility.address}
            </div>
            <div className="flex items-center mr-6">
              <Clock className="w-4 h-4 mr-2" />
              {facility.openTime} - {facility.closeTime}
            </div>
            {facility.phone && (
              <div className="flex items-center mr-6">
                <Phone className="w-4 h-4 mr-2" />
                {facility.phone}
              </div>
            )}
          </div>
          
          {facility.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-200 mb-2">About</h2>
              <p className="text-gray-400">{facility.description}</p>
            </div>
          )}

          {(facility.latitude && facility.longitude) && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-200 mb-3">Location</h2>
              <RestaurantMap 
                latitude={facility.latitude} 
                longitude={facility.longitude}
                name={facility.name}
                className="h-[300px] w-full rounded-md overflow-hidden"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
