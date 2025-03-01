import { auth, prisma } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { displayName, bio, phoneNumber, location } = await req.json();

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        displayName,
        bio,
        phoneNumber,
        location,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      user: {
        ...updatedUser,
        password: undefined
      }
    });
  } catch (error) {
    console.error("Profile update error:", error);
    
    // Type check the error before accessing the message property
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
