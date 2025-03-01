import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const userId = (await params).userId

    try {
        const response = await auth.api.listUsers({
            query: {
                filterField: 'id',
                filterValue: userId
            },
            headers: await headers()
        })

        const user = response.users[0]
        if (!user) {
            return new NextResponse('User not found', { status: 404 })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error('Error fetching user:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
