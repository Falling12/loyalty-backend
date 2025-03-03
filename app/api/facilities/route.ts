import { prisma } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const facilities = await prisma.facility.findMany({
            include: {
                images: true,
            },
        });
    
        return NextResponse.json(facilities);
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) { 
        // Using _error pattern that will be ignored by our updated ESLint config
        return new Response(JSON.stringify({ error: "Failed to fetch facilities" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}