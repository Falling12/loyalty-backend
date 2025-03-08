import Link from 'next/link'
import { getEvents } from '@/app/actions/event'

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-100">Events</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
            Back to Home
          </Link>
        </div>
        <Link href="/events/new" className="text-blue-400 hover:text-blue-300 transition-colors">
          Create New Event
        </Link>
        <div className="mt-6 space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-100">{event.name}</h2>
              <p className="text-gray-400">{event.description}</p>
              <p className="text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
              <p className="text-gray-400">Category: {event.categories.map(cat => cat.category.name).join(', ')}</p>
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
