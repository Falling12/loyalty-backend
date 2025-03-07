import Link from 'next/link'
import { prisma } from '@/lib/auth'

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    include: {
      category: true,
    },
  })

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">Events</h1>
        <Link href="/events/new" className="text-blue-400 hover:text-blue-300 transition-colors">
          Create New Event
        </Link>
        <div className="mt-6 space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-100">{event.name}</h2>
              <p className="text-gray-400">{event.description}</p>
              <p className="text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
              <p className="text-gray-400">Category: {event.category.name}</p>
              <Link href={`/events/${event.id}/edit`} className="text-blue-400 hover:text-blue-300 transition-colors">
                Edit
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
