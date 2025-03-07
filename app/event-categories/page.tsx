import Link from 'next/link'
import { prisma } from '@/lib/auth'

export default async function EventCategoriesPage() {
  const categories = await prisma.eventCategory.findMany()

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">Event Categories</h1>
        <Link href="/event-categories/new" className="text-blue-400 hover:text-blue-300 transition-colors">
          Create New Event Category
        </Link>
        <div className="mt-6 space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-100">{category.name}</h2>
              <Link href={`/event-categories/${category.id}/edit`} className="text-blue-400 hover:text-blue-300 transition-colors">
                Edit
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
