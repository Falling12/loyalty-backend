'use server'

import { auth, prisma } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

export async function deleteQRCode(qrId: string, userId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user.role?.includes('admin')) {
            throw new Error('Unauthorized')
        }

        await prisma.qRCode.delete({
            where: {
                id: qrId,
                userId: userId // Extra safety check
            }
        })

        revalidatePath(`/${userId}`)
        return { success: true }
    } catch (error) {
        console.error('Error deleting QR code:', error)
        return { success: false }
    }
}
