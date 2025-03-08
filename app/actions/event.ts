'use server'

import { prisma } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export interface EventFormData {
  name: string
  description: string 
  date: Date
  categoryIds: string[]
}

export async function createEvent(data: EventFormData) {
  const event = await prisma.event.create({
    data: {
      name: data.name,
      description: data.description,
      date: data.date,
      categories: {
        create: data.categoryIds.map((categoryId) => ({
          categoryId,
        })),
      },
    },
  })

  revalidatePath('/events')
  return event
}

export async function updateEvent(id: string, data: EventFormData) {
  const event = await prisma.event.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      date: data.date,
      categories: {
        deleteMany: {},
        create: data.categoryIds.map((categoryId) => ({
          categoryId,
        })),
      },
    },
  })

  revalidatePath(`/events/${id}`)
  return event
}

export async function deleteEvent(id: string) {
  await prisma.event.delete({
    where: { id },
  })

  revalidatePath('/events')
}

export interface EventCategoryFormData {
  name: string
}

export async function createEventCategory(data: EventCategoryFormData) {
  const category = await prisma.eventCategory.create({
    data: {
      name: data.name,
    },
  })

  revalidatePath('/event-categories')
  return category
}

export async function updateEventCategory(id: string, data: EventCategoryFormData) {
  const category = await prisma.eventCategory.update({
    where: { id },
    data: {
      name: data.name,
    },
  })

  revalidatePath(`/event-categories/${id}`)
  return category
}

export async function deleteEventCategory(id: string) {
  await prisma.eventCategory.delete({
    where: { id },
  })

  revalidatePath('/event-categories')
}

export async function getEvent(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  })
  return event
}

export async function getEvents() {
  const events = await prisma.event.findMany({
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  })
  return events
}
