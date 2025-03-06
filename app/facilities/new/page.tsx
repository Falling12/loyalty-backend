"use client"
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { FacilityForm } from '../../components/forms/facility-form'
import { createFacility } from '../../actions/facility'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// Define the FormOutputData type to match the one in facility-form.tsx
type FormOutputData = {
  name: string;
  address: string;
  description: string | null;
  phone: string | null;
  openTime: string;
  closeTime: string;
  latitude: number | null;
  longitude: number | null;
  images: string[];
}

export default function NewFacilityPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: FormOutputData) => {
    setSubmitError(null);
    try {
      console.log("Submitting new facility:", data);
      await createFacility({
        ...data,
        description: data.description || '',
        phone: data.phone || '',
      });
      console.log("Facility created successfully");
      router.push('/facilities');
    } catch (error) {
      console.error("Error creating facility:", error);
      setSubmitError("Failed to create facility. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="mb-6">
        <Link 
          href="/facilities" 
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Facilities
        </Link>
      </div>

      <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">New Facility</h1>
        <FacilityForm onSubmit={handleSubmit} />
        {submitError && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-md">
            <p className="text-red-200">{submitError}</p>
          </div>
        )}
      </div>
    </div>
  )
}
