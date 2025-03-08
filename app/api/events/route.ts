import { prisma } from '@/lib/auth'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        images: true,
      },
    })
  
    return new Response(JSON.stringify(events), {
      headers: { 'Content-Type': 'application/json' },
    })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return new Response('Error fetching events', {
      status: 500,
      statusText: 'Internal Server Error',
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
