import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Map file extensions to MIME types
const mimeTypes: Record<string, string> = {
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'svg': 'image/svg+xml',
  'webp': 'image/webp',
}

// Function to get file extension without using path module
function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return '';
  return filename.slice(lastDotIndex + 1).toLowerCase();
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Only handle requests for the uploads directory
  if (pathname.startsWith('/uploads/')) {
    // Get the file extension without using path module
    const ext = getFileExtension(pathname);
    
    // If we recognize this as an image type, set the correct content type
    if (ext in mimeTypes) {
      // Add the correct content type
      return NextResponse.next({
        headers: {
          'content-type': mimeTypes[ext],
          // Add CORS headers to allow cross-origin access
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }
  }
  
  return NextResponse.next()
}

export const config = {
  // Update matcher to ensure it runs for all environments
  matcher: ['/uploads/:path*'],
}
