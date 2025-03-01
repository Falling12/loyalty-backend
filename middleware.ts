import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    try {
        const authCookie = request.cookies.get('better-auth.session_token')
        const isAdminRoute = !request.nextUrl.pathname.match(/^\/(?:login|register)$/)

        if (isAdminRoute) {
            if (!authCookie?.value) {
                return NextResponse.redirect(new URL('/login', request.url))
            }

            // Verify session through API route instead of direct Prisma access
            const sessionResponse = await fetch(new URL('https://backend.scsanad.hu/api/auth/get-session', request.url), {
                headers: {
                    cookie: `better-auth.session_token=${authCookie.value}`
                }
            })

            if (!sessionResponse.ok) {
                return NextResponse.redirect(new URL('/login', request.url))
            }

            const session = await sessionResponse.json()
            
            if (session?.user?.role !== 'admin') {
                return NextResponse.redirect(new URL('/login', request.url))
            }
        }

        return NextResponse.next()
    } catch (error) {
        console.error('Session validation error:', error)
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: [
        // Exclude public/uploads and other static resources
        '/((?!api|_next/static|_next/image|favicon.ico|uploads).*)',
    ],
}
