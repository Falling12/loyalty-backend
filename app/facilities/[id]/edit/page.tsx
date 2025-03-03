import { prisma } from '@/lib/auth'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { updateFacility } from '../../../actions/facility'
import { FacilityForm } from '../../../components/forms/facility-form'
// Import both types
import type { FacilityFormData } from '../../../actions/facility'
import type { FormOutputData } from '../../../components/forms/facility-form'

export default async function EditFacilityPage({ 
  params
}: { 
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const facility = await prisma.facility.findUnique({
    where: { id },
    include: { images: true }
  })

  if (!facility) {
    return (
      <div className="min-h-screen bg-gray-800 p-6">
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <p className="text-gray-400">Facility not found</p>
        </div>
      </div>
    )
  }

  // Update the parameter type to match what FacilityForm component expects (FormOutputData)
  const handleUpdate = async (formData: FormOutputData) => {
    'use server'
    
    // Create a properly typed object to pass to updateFacility
    const facilityData: FacilityFormData = {
      name: formData.name,
      address: formData.address,
      // Convert nullable fields to non-nullable if needed
      description: formData.description || '', // Handle null case
      phone: formData.phone || '', // Handle null case
      openTime: formData.openTime,
      closeTime: formData.closeTime,
      // Handle potentially null coordinates
      longitude: formData.longitude,
      latitude: formData.latitude,
      images: formData.images || [] // Add the missing images property
    }
    
    await updateFacility(id, facilityData)
  }

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="mb-6">
        <Link 
          href={`/facilitys/${id}`}
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Facility
        </Link>
      </div>

      <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">Edit Facility</h1>
        <FacilityForm 
          facility={facility}
          onSubmit={handleUpdate}
        />
      </div>
    </div>
  )
}
