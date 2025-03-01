import { logActivity, ActivityActions } from "@/lib/activity";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/auth";

export async function PATCH(req: Request) {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    
    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            displayName: data.displayName,
            bio: data.bio,
            // ...other fields...
        }
    });

    await logActivity({
        action: ActivityActions.PROFILE_UPDATE,
        details: `Updated profile fields: ${Object.keys(data).join(', ')}`,
        userId: session.user.id,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') as string
    });

    return Response.json({ success: true });
}
