import { auth } from "@/lib/auth";
import { prisma } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: req.headers
    });

    if (!session || !session.user.role?.includes('admin')) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Delete any expired or used QR codes for cleanup
    await prisma.qRCode.deleteMany({
        where: {
            userId: userId,
            OR: [
                { expiresAt: { lt: new Date() } },
                { used: true }
            ]
        }
    });

    const qrCode = await prisma.qRCode.create({
        data: {
            userId: userId,
            code: crypto.randomBytes(32).toString('hex'),
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
            adminId: null
        }
    });

    return NextResponse.json({ code: qrCode.code });
}
