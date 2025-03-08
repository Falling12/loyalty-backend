"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createEventCategory, EventCategoryFormData } from '@/app/actions/event'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { EventCategoryForm } from '@/app/components/forms/event-category-form'

export default function NewEventPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: EventCategoryFormData) => {
    setError(null)
    try {
      await createEventCategory(data)
      router.push('/event-categories')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      setError('Failed to create event')
    }
  }

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="mb-6">
        <Link 
          href="/event-categories" 
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Event Categories
        </Link>
      </div>
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">New Event Category</h1>
        <EventCategoryForm onSubmit={handleSubmit} />
        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-md">
            <p className="text-red-200">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
