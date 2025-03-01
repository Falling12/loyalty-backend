import { auth } from "@/lib/auth";
import { prisma } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: req.headers
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete any expired or used QR codes for cleanup
    await prisma.qRCode.deleteMany({
        where: {
            userId: session.user.id,
            OR: [
                { expiresAt: { lt: new Date() } },
                { used: true }
            ]
        }
    });

    const qrCode = await prisma.qRCode.create({
        data: {
            userId: session.user.id,
            code: crypto.randomBytes(32).toString('hex'),
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        }
    });

    return NextResponse.json({ code: qrCode.code });
}
