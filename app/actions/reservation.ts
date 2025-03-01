'use server'

import { prisma } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { logActivity } from '@/lib/activity'
import { Prisma } from '@prisma/client'

async function checkAvailability(
  restaurantId: string,
  date: Date,
  time: string,
  partySize: number,
  excludeReservationId?: string
) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
  });

  if (!restaurant) {
    throw new Error('Restaurant not found');
  }

  if (partySize > restaurant.maxPartySize) {
    throw new Error(`Party size cannot exceed ${restaurant.maxPartySize} people per table`);
  }

  // Calculate how many tables this reservation needs
  const tablesNeeded = Math.ceil(partySize / restaurant.maxPartySize);

  // Get existing reservations for the same time slot
  const existingReservations = await prisma.reservation.findMany({
    where: {
      restaurantId,
      date: {
        equals: date,
      },
      time: {
        equals: time,
      },
      status: {
        not: 'CANCELLED',
      },
      ...(excludeReservationId ? { NOT: { id: excludeReservationId } } : {}),
    },
  });

  // Calculate total tables needed for existing reservations
  const tablesOccupied = existingReservations.reduce((acc, reservation) => {
    return acc + Math.ceil(reservation.partySize / restaurant.maxPartySize);
  }, 0);

  // Check if enough tables are available
  const tablesAvailable = restaurant.tables - tablesOccupied;
  
  if (tablesNeeded > tablesAvailable) {
    throw new Error('No available tables for this time slot');
  }

  return true;
}

export interface ReservationData {
  userId: string
  restaurantId: string
  date: string
  time: string
  partySize: number
  status: string
}

export async function createReservation(data: ReservationData) {
    const { userId, restaurantId, date, time, partySize, status } = data
    
    try {
        // Check if user already has a reservation on this date at this restaurant
        const existingReservation = await prisma.reservation.findFirst({
            where: {
                userId,
                restaurantId,
                date: new Date(date),
                status: {
                    not: 'CANCELLED'
                }
            }
        });

        if (existingReservation) {
            throw new Error('You already have a reservation at this restaurant on this date');
        }

        await checkAvailability(restaurantId, new Date(date), time, partySize);
        
        await prisma.reservation.create({
            data: {
                userId,
                restaurantId,
                date: new Date(date),
                time,
                partySize,
                status
            }
        });

        await logActivity({
            action: 'RESERVATION_CREATE',
            details: `Created reservation for restaurant ${restaurantId}`,
            userId
        });

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new Error('You already have a reservation at this restaurant on this date');
            }
        }
        throw error;
    }
    
    revalidatePath('/reservations');
    redirect('/reservations');
}

export async function updateReservation(id: string, data: ReservationData) {
    const { date, time, partySize, status } = data

    try {
        const currentReservation = await prisma.reservation.findUnique({
            where: { id }
        });

        if (!currentReservation) {
            throw new Error('Reservation not found');
        }

        if (status !== 'CANCELLED') {
            await checkAvailability(
                currentReservation.restaurantId,
                new Date(date),
                time,
                partySize,
                id
            );
        }

        const reservation = await prisma.reservation.update({
            where: { id },
            data: {
                date: new Date(date),
                time,
                partySize,
                status
            }
        });

        await logActivity({
            action: 'RESERVATION_UPDATE',
            details: `Updated reservation ${id}`,
            userId: reservation.userId
        });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) { 
        // Using _error pattern that will be ignored by our updated ESLint config
        throw new Error('Failed to update reservation');
    } 

    revalidatePath('/reservations');
    redirect('/reservations');
}

export async function deleteReservation(id: string) {
    const reservation = await prisma.reservation.delete({
        where: { id }
    })

    await logActivity({
        action: 'RESERVATION_DELETE',
        details: `Deleted reservation ${id}`,
        userId: reservation.userId
    })

    revalidatePath('/reservations')
    redirect('/reservations')
}
