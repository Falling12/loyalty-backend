import { prisma } from "@/lib/auth";
import { format, subDays } from "date-fns";

export async function getDashboardData() {
  // Get last 7 days of reservations
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, 'yyyy-MM-dd');
  }).reverse();

  const reservationsData = await Promise.all(
    last7Days.map(async (date) => {
      const count = await prisma.reservation.count({
        where: {
          date: {
            gte: new Date(date),
            lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
          },
        },
      });
      return {
        date: format(new Date(date), 'MMM dd'),
        reservations: count,
      };
    })
  );

  // Get restaurant activity
  const restaurantActivity = await prisma.restaurant.findMany({
    select: {
      name: true,
      _count: {
        select: {
          reservations: true,
        },
      },
    },
    take: 5,
    orderBy: {
      reservations: {
        _count: 'desc',
      },
    },
  });

  const restaurantData = restaurantActivity.map((restaurant) => ({
    name: restaurant.name,
    reservations: restaurant._count.reservations,
  }));

  // Get reservation status distribution
  const statusCounts = await prisma.reservation.groupBy({
    by: ['status'],
    _count: true,
  });

  const statusData = statusCounts.map((status) => ({
    name: status.status,
    value: status._count,
  }));

  return {
    reservationsData,
    restaurantData,
    statusData,
  };
}
