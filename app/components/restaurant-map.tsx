'use client'

import { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface RestaurantMapProps {
  latitude: number | null
  longitude: number | null
  name: string
  className?: string
}

export function RestaurantMap({ latitude, longitude, name, className = "h-64 w-full" }: RestaurantMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Check if we have valid coordinates
    if (!latitude || !longitude) return

    // Load Google Maps API
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly'
    })

    loader.load().then((google) => {
      if (!mapRef.current) return

      const location = { lat: latitude, lng: longitude }
      const map = new google.maps.Map(mapRef.current, {
        center: location,
        zoom: 15,
      })

      // Add a marker
      new google.maps.Marker({
        position: location,
        map: map,
        title: name
      })
    })
  }, [latitude, longitude, name])

  if (!latitude || !longitude) {
    return (
      <div className={`${className} bg-gray-800 flex items-center justify-center rounded-md`}>
        <p className="text-gray-500">No location data available</p>
      </div>
    )
  }

  return <div ref={mapRef} className={`${className} rounded-md`} />
}
