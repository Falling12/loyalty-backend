'use server'

import { prisma } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { deleteImage } from './deleteImage'

export interface RestaurantFormData {
  name: string
  address: string
  description: string
  cuisine: string
  phone: string
  openTime: string
  closeTime: string
  images: string[] // Make images required but can be empty array
  tables: number
  maxPartySize: number
  latitude: number | null
  longitude: number | null
}

export async function createRestaurant(data: RestaurantFormData) {
  const restaurant = await prisma.restaurant.create({
    data: {
      name: data.name,
      address: data.address,
      description: data.description,
      cuisine: data.cuisine,
      phone: data.phone,
      openTime: data.openTime,
      closeTime: data.closeTime,
      tables: data.tables,
      maxPartySize: data.maxPartySize,
      latitude: data.latitude ?? undefined,
      longitude: data.longitude ?? undefined,
      ...(data.images && data.images.length > 0 ? {
        images: {
          create: data.images.map((url, index) => ({
            url,
            isPrimary: index === 0,
            order: index,
          }))
        }
      } : {})
    },
    include: {
      images: true
    }
  })

  revalidatePath('/restaurants')
  return restaurant
}

export async function updateRestaurant(id: string, data: RestaurantFormData) {
  try {
    // Get existing images before update
    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: { images: true }
    })

    const oldImageUrls = existingRestaurant?.images.map(img => img.url) || []
    
    // Delete existing image records
    await prisma.restaurantImage.deleteMany({
      where: { restaurantId: id }
    })

    // Update restaurant with new data
    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        description: data.description,
        cuisine: data.cuisine,
        phone: data.phone,
        openTime: data.openTime,
        closeTime: data.closeTime,
        tables: data.tables,
        maxPartySize: data.maxPartySize,
        latitude: data.latitude ?? undefined,
        longitude: data.longitude ?? undefined,
        ...(data.images?.length > 0 ? {
          images: {
            createMany: {
              data: data.images.map((url, index) => ({
                url,
                isPrimary: index === 0,
                order: index,
              }))
            }
          }
        } : {})
      },
      include: {
        images: true
      }
    })

    // Delete old images that are no longer used
    const imagesToDelete = oldImageUrls.filter(oldUrl => !data.images.includes(oldUrl))
    await Promise.all(imagesToDelete.map(url => deleteImage(url)))

    revalidatePath(`/restaurants/${id}`)
    return restaurant
  } catch (error) {
    console.error('Failed to update restaurant:', error)
    throw error
  }
}

export async function deleteRestaurant(id: string) {
  await prisma.restaurant.delete({
    where: { id },
  })

  revalidatePath('/restaurants')
}
