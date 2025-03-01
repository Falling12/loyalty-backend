import { prisma } from "@/lib/auth";

export async function logActivity({
    action,
    details,
    userId,
    ipAddress
}: {
    action: string;
    details: string;
    userId?: string;
    ipAddress?: string;
}) {
    return prisma.activityLog.create({
        data: {
            action,
            details,
            userId,
            ipAddress
        }
    });
}

export const ActivityActions = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    PASSWORD_CHANGE: 'PASSWORD_CHANGE',
    PROFILE_UPDATE: 'PROFILE_UPDATE',
    RESERVATION_CREATE: 'RESERVATION_CREATE',
    RESERVATION_CANCEL: 'RESERVATION_CANCEL',
    RESERVATION_UPDATE: 'RESERVATION_UPDATE',
    RESERVATION_DELETE: 'RESERVATION_DELETE',
    BALANCE_UPDATE: 'BALANCE_UPDATE',
    QR_CODE_GENERATE: 'QR_CODE_GENERATE',
    QR_CODE_USE: 'QR_CODE_USE'
} as const;
