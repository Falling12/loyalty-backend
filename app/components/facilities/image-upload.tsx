'use client'

import { useState } from 'react'
import { UploadDropzone } from '@/lib/uploadthing'
import Image from 'next/image'
import { X } from 'lucide-react'

interface ImageUploadProps {
  maxImages?: number;
  initialImages?: string[];
  onChange: (urls: string[]) => void;
}

export function ImageUpload({ 
  maxImages = 1,
  initialImages = [],
  onChange
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages)

  const onDelete = (url: string) => {
    const filteredImages = images.filter((image) => image !== url)
    setImages(filteredImages)
    onChange(filteredImages)
  }

  const onUploadComplete = (res: { url: string }[]) => {
    const urls = res.map((image) => image.url)
    
    // If maxImages is 1, replace the existing image
    if (maxImages === 1) {
      setImages(urls)
      onChange(urls)
    } else {
      // Otherwise add to the array up to maxImages
      const newImages = [...images, ...urls].slice(0, maxImages)
      setImages(newImages)
      onChange(newImages)
    }
  }

  return (
    <div className="mb-4 space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((url) => (
          <div key={url} className="relative w-24 h-24 rounded-md overflow-hidden">
            <div className="absolute top-1 right-1 z-10">
              <button
                type="button"
                onClick={() => onDelete(url)}
                className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Image 
              src={url} 
              alt="Uploaded image" 
              fill 
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {images.length < maxImages && (
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res) {
              onUploadComplete(res)
            }
          }}
          onUploadError={(error: Error) => {
            console.error(error)
          }}
          className="ut-label:text-gray-200 ut-button:bg-blue-600 ut-button:hover:bg-blue-700 ut-allowed-content:text-gray-300 border-dashed border-2 border-gray-400 rounded-lg p-4 ut-upload-icon:text-gray-400"
        />
      )}
    </div>
  )
}
