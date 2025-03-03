import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import path from 'path'

// Map file extensions to MIME types
const mimeTypes: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Only handle requests for the uploads directory
  if (pathname.startsWith('/uploads/')) {
    // Get the file extension
    const ext = path.extname(pathname).toLowerCase()
    
    // If we recognize this as an image type, set the correct content type
    if (ext in mimeTypes) {
      // Clone the response and add the correct content type
      return NextResponse.next({
        headers: {
          'content-type': mimeTypes[ext],
        },
      })
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/uploads/:path*',
}
