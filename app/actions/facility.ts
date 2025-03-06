'use server'

import { prisma } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { deleteImage } from './deleteImage'

export interface FacilityFormData {
  name: string
  address: string
  description: string
  phone: string
  openTime: string
  closeTime: string
  images: string[] // Make images required but can be empty array
  latitude: number | null
  longitude: number | null
}

export async function createFacility(data: FacilityFormData) {
  console.log('Creating facility with data:', data)
  const facility = await prisma.facility.create({
    data: {
      name: data.name,
      address: data.address,
      description: data.description,
      phone: data.phone,
      openTime: data.openTime,
      closeTime: data.closeTime,
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

  revalidatePath('/facilities')
  return facility
}

export async function updateFacility(id: string, data: FacilityFormData) {
  try {
    // Get existing images before update
    const existingFacility = await prisma.facility.findUnique({
      where: { id },
      include: { images: true }
    })

    const oldImageUrls = existingFacility?.images.map(img => img.url) || []
    
    // Delete existing image records
    await prisma.facilityImage.deleteMany({
      where: { facilityId: id }
    })

    // Update facility with new data
    const facility = await prisma.facility.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        description: data.description,
        phone: data.phone,
        openTime: data.openTime,
        closeTime: data.closeTime,
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

    revalidatePath(`/facility/${id}`)
    return facility
  } catch (error) {
    console.error('Failed to update facility:', error)
    throw error
  }
}

export async function deleteFacility(id: string) {
  await prisma.facility.delete({
    where: { id },
  })

  revalidatePath('/facilities')
}
