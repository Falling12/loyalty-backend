import { redirect } from 'next/navigation'
import { EventCategoryFormData, updateEventCategory } from '@/app/actions/event'
import { prisma } from '@/lib/auth'
import { EventCategoryForm } from '@/app/components/forms/event-category-form'

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const eventCategory = await prisma.eventCategory.findUnique({
    where: { id },
  })

  const handleSubmit = async (data: EventCategoryFormData) => {
    "use server"
    if (!id) return
    
    try {
      await updateEventCategory(id, data)
    } catch (error) {
      console.error('Failed to update event:', error)
    }

    redirect(`/event-categories`)
  }

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">Edit Event</h1>
        <EventCategoryForm onSubmit={handleSubmit} eventCategory={{
            id: eventCategory!.id,
            name: eventCategory!.name,
        }} />
      </div>
    </div>
  )
}
