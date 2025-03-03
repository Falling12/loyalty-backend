import { NextResponse } from 'next/server';
import { prisma } from '@/lib/auth';

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 1 },
    });

    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }

    return NextResponse.json({
      appIconUrl: settings.appIconUrl,
      backgroundImageUrl: settings.backgroundImageUrl,
    });
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}
