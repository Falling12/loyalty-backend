import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { admin, bearer, createAuthMiddleware, openAPI } from "better-auth/plugins";
import { expo } from "@better-auth/expo";
import { logActivity, ActivityActions } from "./activity";

export const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [admin(), openAPI(), bearer(), expo()],
    trustedOrigins: ["myapp://", "https://backend.scsanad.hu"],
    user: {
        additionalFields: {
            displayName: {
                type: "string",
            },
            bio: {
                type: "string",
            },
            phoneNumber: {
                type: "string",
            },
            location: {
                type: "string",
            },
            balance: {
                type: "number",
            },
        }
    },
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            if (ctx.path.startsWith("/sign-in")) {
                const newSession = ctx.context.newSession
                console.log(newSession)
                await logActivity({
                    action: ActivityActions.LOGIN,
                    details: `User logged in`,
                    userId: newSession!.user.id,
                    ipAddress: newSession?.session.ipAddress as string
                });
            }
            if (ctx.path.startsWith("/sign-out")) {
                const session = ctx.context.session
                await logActivity({
                    action: ActivityActions.LOGOUT,
                    details: `User logged out`,
                    userId: session!.user.id,
                    ipAddress: session?.session.ipAddress as string
                });
            }
        })
    }
});