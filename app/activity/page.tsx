import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/auth";
import { formatDistanceToNow } from "date-fns";

export default async function ActivityPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return (
            <div className="flex items-center justify-center min-h-[400px] bg-gray-900 rounded-lg">
                <p className="text-gray-400">Not authenticated</p>
            </div>
        );
    }

    const activities = await prisma.activityLog.findMany({
        include: {
            user: true
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 100
    });

    return (
        <div className="p-6 bg-gray-800 rounded-lg shadow-sm">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-100">Activity Monitor</h1>
                <p className="text-gray-400 mt-2">Recent system activities and logs</p>
            </div>

            <div className="bg-gray-900 rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-800">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Details</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">IP Address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {activities.map((activity) => (
                            <tr key={activity.id} className="hover:bg-gray-800/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{activity.action}</td>
                                <td className="px-6 py-4 text-sm text-gray-300">{activity.details}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {activity.user?.name || 'System'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{activity.ipAddress || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
