import { auth } from "@/lib/auth";
import { prisma } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import fs from "fs";
import { validateWalletQr } from "@/lib/generateWalletQr";

const serviceAccount = JSON.parse(fs.readFileSync("wallet-key.json", "utf8"));
const wallet = google.walletobjects({
  version: "v1",
  auth: new google.auth.JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: ["https://www.googleapis.com/auth/wallet_object.issuer"],
  }),
});

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: req.headers
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (admin?.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { code, amount, type } = await req.json();

    // First try to validate as a wallet QR
    const walletValidation = validateWalletQr(code);
    
    let userId: string;
    if (walletValidation) {
        // Wallet QR code - no expiration check needed
        userId = walletValidation.userId;
    } else {
        // Traditional QR code validation
        const qrCode = await prisma.qRCode.findUnique({
            where: { code },
            include: { user: true }
        });

        if (!qrCode || qrCode.used || qrCode.expiresAt < new Date()) {
            return NextResponse.json({ error: "Invalid QR code" }, { status: 400 });
        }

        userId = qrCode.user.id;
        
        // Mark temporary QR as used
        await prisma.qRCode.update({
            where: { id: qrCode.id },
            data: { used: true }
        });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newBalance = type === "ADD" 
        ? user.balance + amount
        : user.balance - amount;

    // Update Google Wallet
    if (user.passId) {
        try {
            await wallet.loyaltyobject.patch({
                resourceId: user.passId,
                requestBody: {
                    loyaltyPoints: {
                        balance: {
                            string: `${newBalance} points`,
                        },
                    },
                },
            });
        } catch (error) {
            console.error('Failed to update Google Wallet pass:', error);
        }
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            balance: type === "ADD" 
                ? { increment: amount }
                : { decrement: amount }
        }
    });

    await prisma.transaction.create({
        data: {
            userId: user.id,
            amount,
            type,
            adminId: session.user.id
        }
    });

    return NextResponse.json({ success: true });
}
