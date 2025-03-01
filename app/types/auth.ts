export interface User {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image: string | null
    createdAt: string
    updatedAt: string
    role: string
    banned: boolean | null
    banReason: string | null
    banExpires: string | null
    displayName: string | null
    bio: string | null
    phoneNumber: string | null
    location: string | null
    balance: number
}
