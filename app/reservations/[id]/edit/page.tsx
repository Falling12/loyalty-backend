import { prisma } from '@/lib/auth'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { updateReservation, deleteReservation, ReservationData } from '@/app/actions/reservation'
import { Button } from '@/app/components/ui/button'
import { ReservationForm } from '@/app/components/forms/reservation-form'

export default async function EditReservationPage({ 
  params
}: { 
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      user: true,
      restaurant: true
    }
  })

  if (!reservation) {
    return (
      <div className="min-h-screen bg-gray-800 p-6">
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <p className="text-gray-400">Reservation not found</p>
        </div>
      </div>
    )
  }

  const users = await prisma.user.findMany()
  const restaurants = await prisma.restaurant.findMany()

  const handleUpdate = async (data: ReservationData) => {
    'use server'
    await updateReservation(id, data)
  }

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="mb-6">
        <Link 
          href="/reservations" 
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reservations
        </Link>
      </div>

      <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-100">Edit Reservation</h1>
          <form action={deleteReservation.bind(null, id)}>
            <Button variant="danger" type="submit">Delete Reservation</Button>
          </form>
        </div>

        <ReservationForm 
          users={users}
          restaurants={restaurants}
          reservation={reservation}
          onSubmit={handleUpdate}
          allowCustomerChange={false}
          allowRestaurantChange={false}
        />
      </div>
    </div>
  )
}
