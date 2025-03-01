import { auth, prisma } from "@/lib/auth";
import { headers } from "next/headers";
import { Pagination } from "../components/ui/pagination";
import { redirect } from 'next/navigation';
import { 
    UserSearch, 
    AddUserModal,
    UserCard 
} from "../components/users";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function UsersPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const page = (await searchParams).page;
    const q = (await searchParams).q;
    const pageSize = 9;
    const currentPage = Number(page) || 1;

    interface Where {
        OR?: object[]
    }

    const where: Where = {};

    if (q) {
        where.OR = [
            { name: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } }
        ];
    }

    const session = await auth.api.getSession({
        headers: await headers()
    })

    const [usersRaw, totalUsers] = await Promise.all([
        prisma.user.findMany({
            where,
            skip: (currentPage - 1) * pageSize,
            take: pageSize,
            orderBy: {
                createdAt: 'desc'
            }
        }),
        prisma.user.count({ where })
    ]);

    // Convert Date objects to strings
    const users = usersRaw.map(user => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        emailVerified: user.emailVerified,
        banExpires: user.banExpires ? user.banExpires.toISOString() : null,
        role: user.role as string,
    }));

    const totalPages = Math.ceil(totalUsers / pageSize);
    
    if (
        isNaN(currentPage) || 
        currentPage < 1 || 
        currentPage > totalPages || 
        !Number.isInteger(currentPage)
    ) {
        redirect('/users');
    }

    if(!session) {
        return (
            <div className="flex items-center justify-center min-h-[400px] bg-gray-900 rounded-lg">
                <p className="text-gray-400">Not authenticated</p>
            </div>
        )
    }

    return (
        <div className="p-6 bg-gray-800 rounded-lg shadow-sm min-h-screen">
            <div className="mb-6">
                <Link 
                    href="/" 
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>
            </div>

            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold text-gray-200">Users Directory</h2>
                        <UserSearch />
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-gray-400">
                            Page {currentPage} of {totalPages}
                        </p>
                        <AddUserModal />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map(user => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>

                <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
        </div>
    )
}
