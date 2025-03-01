import { prisma } from '@/lib/auth'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createReservation } from '@/app/actions/reservation'
import { ReservationForm } from '@/app/components/forms/reservation-form'

export default async function NewReservationPage() {
  const users = await prisma.user.findMany()
  const restaurants = await prisma.restaurant.findMany()

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
        <h1 className="text-2xl font-bold text-gray-100 mb-6">New Reservation</h1>
        <ReservationForm 
          users={users} 
          restaurants={restaurants} 
          onSubmit={createReservation} 
        />
      </div>
    </div>
  )
}
