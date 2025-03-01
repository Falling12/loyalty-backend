'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  maxImages: number
  initialImages?: string[]
  onChange?: (urls: string[]) => void
}

export function ImageUpload({ maxImages, initialImages = [], onChange }: ImageUploadProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(initialImages)

  const handleUploadComplete = (url: string) => {
    const newUrls = [...imageUrls, url]
    setImageUrls(newUrls)
    onChange?.(newUrls)
  }

  const handleRemoveImage = (urlToRemove: string) => {
    const newUrls = imageUrls.filter(url => url !== urlToRemove)
    setImageUrls(newUrls)
    onChange?.(newUrls)
  }

  const [uploading, setUploading] = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current && initialImages.length > 0) {
      setImageUrls(initialImages)
      initialized.current = true
    }
  }, [initialImages])

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    return data.url
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploading(true)
    try {
      await Promise.all(
        Array.from(files).map(async (file) => {
          const url = await uploadFile(file)
          handleUploadComplete(url)
          return { url, file }
        })
      )
    } catch (error) {
      console.error('Upload failed:', error)
      // You might want to add error handling UI here
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative aspect-square">
            <Image
              src={url}
              alt={`Upload preview ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(url)}
              className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <input
              type="hidden"
              name={`images`}
              value={url}
            />
          </div>
        ))}
        {imageUrls.length < maxImages && (
          <label className={`border-2 border-dashed border-gray-600 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-400 mt-2">
              {uploading ? 'Uploading...' : 'Add Image'}
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              disabled={uploading}
            />
          </label>
        )}
      </div>
      <p className="text-sm text-gray-400">
        Upload up to {maxImages} images. First image will be the primary image.
      </p>
    </div>
  )
}
