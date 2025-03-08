"use client"

import { useState } from 'react'
import { useRouter } from 'next/router'
import { EventFormData, updateEvent } from '@/app/actions/event'
import { EventForm } from '@/app/components/forms/event-form'

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: EventFormData) => {
    setError(null)
    try {
      await updateEvent(id, data)
      router.push('/events')
    } catch (error) {
      setError('Failed to update event')
    }
  }

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">Edit Event</h1>
        <EventForm onSubmit={handleSubmit} />
        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-md">
            <p className="text-red-200">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
