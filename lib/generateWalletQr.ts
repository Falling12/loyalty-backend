import crypto from "crypto";

export function generateWalletQr(userId: string | undefined) {
    // Create a permanent hash of the user ID
    const hash = crypto.createHmac('sha256', process.env.QR_SECRET || 'secret')
        .update(userId as string)
        .digest('hex');
    
    return `WALLET:${userId}:${hash}`;
}

export function validateWalletQr(qrValue: string): { userId: string } | null {
    if (!qrValue.startsWith('WALLET:')) {
        return null;
    }

    const [userId, hash] = qrValue.split(':');
    const expectedHash = crypto.createHmac('sha256', process.env.QR_SECRET || 'secret')
        .update(userId)
        .digest('hex');

    if (hash !== expectedHash) {
        return null;
    }

    return { userId };
}
