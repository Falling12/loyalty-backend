import { prisma } from '@/lib/auth'

export async function GET(req: Request) {
  const events = await prisma.event.findMany({
    include: {
      category: true,
    },
  })

  return new Response(JSON.stringify(events), {
    headers: { 'Content-Type': 'application/json' },
  })
}
