'use server'

import { auth, prisma } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

type CreateUserData = {
    name: string
    email: string
    password: string
    role: 'user' | 'admin'
}

type UpdateUserData = {
    name: string
    email: string
    role: 'user' | 'admin'
    displayName: string | null
    bio: string | null
    phoneNumber: string | null
    location: string | null
    balance: number
}

export async function createUser(data: CreateUserData) {
    try {
        await auth.api.createUser(
            {
                body: {
                    ...data,
                    emailVerified: false
                },
                headers: await headers()
            }
        )
        revalidatePath('/')
    } catch (error) {
        console.error('Failed to create user:', error)
        throw new Error('Failed to create user')
    }
}

export async function updateUser(userId: string, data: UpdateUserData) {
    try {
        console.log('Updating user:', userId, data)

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                balance: data.balance,
                role: data.role,
                name: data.name,
                email: data.email,
                displayName: data.displayName,
                bio: data.bio,
                phoneNumber: data.phoneNumber,
                location: data.location
            }
        })

        revalidatePath(`/${userId}`)
    } catch (error) {
        console.error('Failed to update user:', error)
        throw new Error('Failed to update user')
    }
}
