import { prisma } from '@/lib/auth'
import Link from 'next/link'
import { Plus, ArrowLeft } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { format } from 'date-fns'
import { Pagination } from '@/app/components/ui/pagination/pagination'

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const page = Number((await searchParams).page) || 1
  const pageSize = 10
  const skip = (page - 1) * pageSize

  const [reservations, total] = await Promise.all([
    prisma.reservation.findMany({
      include: {
        user: true,
        restaurant: true
      },
      orderBy: {
        date: 'desc'
      },
      skip,
      take: pageSize,
    }),
    prisma.reservation.count()
  ])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className='flex items-center justify-between mb-6'>
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-100">Reservations</h1>
        </div>
        <Link href="/reservations/new">
          <Button className='flex items-center gap-2'>
            <Plus className="w-4 h-4" />
            New Reservation
          </Button>
        </Link>
      </div>

      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Restaurant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Party Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {reservation.user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {reservation.restaurant.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {format(new Date(reservation.date), 'PP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {reservation.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {reservation.partySize}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      reservation.status === 'CONFIRMED' ? 'bg-green-900 text-green-300' :
                      reservation.status === 'PENDING' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-red-900 text-red-300'
                    }`}>
                      {reservation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <Link href={`/reservations/${reservation.id}/edit`}>
                      <Button variant="secondary" size="sm">Edit</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  )
}
