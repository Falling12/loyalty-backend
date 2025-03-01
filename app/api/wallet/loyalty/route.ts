import { auth, prisma } from "@/lib/auth";
import { google } from "googleapis";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { generateWalletQr } from "@/lib/generateWalletQr";
import { generateApplePass } from "@/lib/generateApplePass";

const serviceAccount = JSON.parse(await fs.readFile("wallet-key.json", "utf8"));
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

  const { type = 'google' } = await req.json();

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id
    }
  });

  try {
    const walletQr = generateWalletQr(session?.user.id);

    if (type === 'apple') {
      const passFilePath = await generateApplePass(
        session?.user.id,
        session?.user.name,
        user?.balance || 0,
        walletQr
      );

      try {
        const passFile = await fs.readFile(passFilePath);
        
        return new NextResponse(passFile, {
          headers: {
            'Content-Type': 'application/vnd.apple.pkpass',
            'Content-Disposition': `attachment; filename="pass.pkpass"`,
          },
        });
      } finally {
        // Clean up the temporary file
        await fs.unlink(passFilePath).catch(console.error);
      }
    }

    const passId = `3388000000022882067.loyalty.${session?.user.id}`;
    
    const passObject = {
      id: passId,
      classId: `3388000000022882067.loyalty`,
      barcode: {
        type: "QR_CODE",
        value: walletQr,
      },
      accountId: session?.user.id,
      accountName: session?.user.name,
      loyaltyPoints: {
        balance: {
          string: `${user?.balance} points`,
        },
      },
      state: "ACTIVE",
      kind: "walletobjects#loyaltyObject",
    };

    const res = await wallet.loyaltyobject.insert({ requestBody: passObject });

    console.log(res.data);
    
    // Update using simple assignment
    await prisma.$executeRaw`UPDATE "user" SET "passId" = ${passId} WHERE "id" = ${session?.user.id}`;

    const payload = {
      iss: serviceAccount.client_email, // Service account email
      aud: "google",
      origins: ["localhost"], // Your app's domain
      typ: "savetowallet",
      payload: {
        genericClasses: [{
          "id": "3388000000022882067.loyalty",
        }],
        genericObjects: [passObject],
      },
    }

    const token = jwt.sign(payload, serviceAccount.private_key, { algorithm: "RS256" });

    return NextResponse.json({ message: "Pass object created", token });
  } catch (error) {
    console.error("Failed to create pass object:", error);
    
    // Type check the error before accessing the message property
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
