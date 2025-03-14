import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Users, Activity, Factory, Settings } from "lucide-react";
import LogoutButton from "./components/dashboard/logoutbutton";

export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) {
        return (
            <div className="flex items-center justify-center min-h-[400px] bg-gray-900 rounded-lg">
                <p className="text-gray-400">Not authenticated</p>
                
                <LogoutButton />
            </div>
        )
    }

    const adminCards = [
        {
            title: "Users Management",
            description: "Manage user accounts, roles, and permissions",
            icon: Users,
            href: "/users",
            color: "blue"
        },
        {
            title: "Facility Management",
            description: "Manage Facilities",
            icon: Factory,
            href: "/facilities",
            color: "green"
        },
        {
            title: "Event Management",
            description: "Manage events and categories",
            icon: Factory,
            href: "/events",
            color: "red"
        },
        {
            title: "Event Categories",
            description: "Manage event categories",
            icon: Factory,
            href: "/event-categories",
            color: "yellow"
        },
        {
            title: "Activity Monitor",
            description: "View system activity and logs",
            icon: Activity,
            href: "/activity",
            color: "purple"
        },
        {
            title: "Settings",
            description: "Configure system settings and preferences",
            icon: Settings,
            href: "/settings",
            color: "orange"
        }
    ]

    return (
        <div className="p-6 bg-gray-800 rounded-lg shadow-sm min-h-screen flex flex-col gap-10">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-100">
                        Welcome, <span className="text-blue-400">{session.user.name}</span>
                    </h1>
                    <p className="text-gray-400 mt-2">Select a section to manage</p>
                </div>

                <LogoutButton />
            </div>


            {/* Admin Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminCards.map((card) => {
                    const Icon = card.icon
                    return (
                        <Link
                            key={card.href}
                            href={card.href}
                            className="bg-gray-900 p-6 rounded-lg hover:bg-gray-900/80 transition-colors"
                        >
                            <div className={`w-12 h-12 rounded-lg bg-${card.color}-900/20 flex items-center justify-center mb-4`}>
                                <Icon className={`w-6 h-6 text-${card.color}-400`} />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-100 mb-2">
                                {card.title}
                            </h2>
                            <p className="text-gray-400 text-sm">
                                {card.description}
                            </p>
                        </Link>
                    )
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            </div>
        </div>
    );
}
