import { prisma } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const restaurants = await prisma.restaurant.findMany({
            include: {
                images: true,
            },
        });
    
        return NextResponse.json(restaurants);
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) { 
        // Using _error pattern that will be ignored by our updated ESLint config
        return new Response(JSON.stringify({ error: "Failed to fetch restaurants" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}