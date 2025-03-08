import { redirect } from 'next/navigation'
import { EventFormData, updateEvent } from '@/app/actions/event'
import { EventForm } from '@/app/components/forms/event-form'
import { prisma } from '@/lib/auth'

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    }
  })

  const handleSubmit = async (data: EventFormData) => {
    "use server"
    if (!id) return
    
    try {
      await updateEvent(id, data)
    } catch (error) {
      console.error('Failed to update event:', error)
    }

    redirect(`/events`)
  }

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">Edit Event</h1>
        <EventForm onSubmit={handleSubmit} event={{
          id: event!.id,
          name: event!.name,
          description: event?.description || '',
          date: new Date(event!.date),
          categories: event?.categories,
          createdAt: event!.createdAt,
          updatedAt: event!.updatedAt,
        }} />
      </div>
    </div>
  )
}
