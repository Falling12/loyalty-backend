import { auth, prisma } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await auth.api.getSession({
        headers: req.headers
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { balance: true }
    });

    return NextResponse.json({ balance: user?.balance ?? 0 });
}
