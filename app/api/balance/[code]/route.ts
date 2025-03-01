import { auth } from "@/lib/auth";
import { prisma } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { validateWalletQr } from "@/lib/generateWalletQr";

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
    const code = (await params).code;

    if (!code) {
        return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

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

    // First try to validate as a wallet QR
    const walletValidation = validateWalletQr(code);
    
    let user;
    if (walletValidation) {
        // Wallet QR code - fetch user directly
        user = await prisma.user.findUnique({
            where: { id: walletValidation.userId },
            select: {
                id: true,
                name: true,
                balance: true
            }
        });
    } else {
        // Traditional QR code validation
        const qrCode = await prisma.qRCode.findUnique({
            where: { code },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        balance: true
                    }
                }
            }
        });

        if (!qrCode) {
            return NextResponse.json({ error: "QR code not found" }, { status: 404 });
        }

        user = qrCode.user;
    }

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
        userId: user.id,
        name: user.name,
        balance: user.balance
    });
}