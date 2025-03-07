import { prisma } from '@/lib/auth'

export async function GET(req: Request) {
  const categories = await prisma.eventCategory.findMany()

  return new Response(JSON.stringify(categories), {
    headers: { 'Content-Type': 'application/json' },
  })
}
