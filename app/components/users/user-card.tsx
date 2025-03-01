import Link from 'next/link'
import { User } from '../../types/auth'

export function UserCard({ user }: { user: User }) {
    return (
        <Link 
            href={`/users/${user.id}`} 
            className="block p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
        >
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-300 font-semibold">
                        {user.name?.[0]?.toUpperCase() || '?'}
                    </span>
                </div>
                <div>
                    <h3 className="font-medium text-gray-100">{user.name}</h3>
                    <p className="text-sm text-gray-400">{user.email}</p>
                </div>
            </div>
        </Link>
    )
}
