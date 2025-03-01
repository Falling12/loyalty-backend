"use client"
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { RestaurantForm } from '../../components/forms/restaurant-form'
import { createRestaurant } from '../../actions/restaurant'
import { redirect } from 'next/navigation'

// Define the FormOutputData type to match the one in restaurant-form.tsx
type FormOutputData = {
  name: string;
  address: string;
  description: string | null;
  cuisine: string | null;
  phone: string | null;
  openTime: string;
  closeTime: string;
  tables: number;
  maxPartySize: number;
  latitude: number | null;
  longitude: number | null;
  images: string[];
}

export default function NewRestaurantPage() {
  // Create a wrapper function that adapts createRestaurant to match the expected type
  const handleSubmit = async (data: FormOutputData) => {
    // Convert null string values to empty strings to satisfy the RestaurantFormData type
    await createRestaurant({
      ...data,
      description: data.description || '',
      cuisine: data.cuisine || '',
      phone: data.phone || '',
    });
    redirect('/restaurants');
  };

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="mb-6">
        <Link 
          href="/restaurants" 
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Restaurants
        </Link>
      </div>

      <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">New Restaurant</h1>
        <RestaurantForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
