import { prisma } from "@/lib/auth";

export async function updateSettings(appIconUrl: string, backgroundImageUrl: string) {
  try {
    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: {
        appIconUrl,
        backgroundImageUrl,
      },
      create: {
        id: 1,
        appIconUrl,
        backgroundImageUrl,
      },
    });
    return settings;
  } catch (error) {
    console.error("Failed to update settings:", error);
    throw new Error("Failed to update settings");
  }
}
