import { unlink } from 'fs'
import { writeFile } from 'fs/promises'
import { NextRequest } from 'next/server'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return new Response('No file uploaded', { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
    const filename = `${uniqueSuffix}-${file.name}`
    
    // Save to public/uploads directory
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    const filePath = path.join(uploadDir, filename)
    
    await writeFile(filePath, buffer)
    
    return new Response(JSON.stringify({ 
      url: `/uploads/${filename}` 
    }), { 
      status: 200 
    })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) { 
    return new Response(JSON.stringify({ success: false, message: 'Error storing file' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(request: NextRequest) {
    try {
        const { pathname } = new URL(request.url)
        const fileName = pathname.split('/').pop()
    
        if (!fileName) {
        return new Response('No file specified', { status: 400 })
        }
    
        const filePath = path.join(process.cwd(), 'public/uploads', fileName)
    
        // Delete the file
        unlink(filePath, (err => {
            if (err) {
                return new Response('Error deleting file', { status: 500 })
            }
        }))
    
        return new Response('File deleted successfully', { status: 200 })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) { 
        return new Response(JSON.stringify({ success: false }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}