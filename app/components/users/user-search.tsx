'use client'

import { Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import qs from 'query-string'

export function UserSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')

    const createQueryString = useCallback((params: Record<string, string | null>) => {
        const current = qs.parse(searchParams.toString())
        const updated = { ...current, ...params }
        return qs.stringify(updated, { skipNull: true })
    }, [searchParams])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const queryString = createQueryString({
            q: searchQuery || null,
            page: '1' // Reset to first page on new search
        })
        router.push(`/?${queryString}`)
    }

    const clearSearch = () => {
        setSearchQuery('')
        router.push('/')
    }

    return (
        <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="pl-3 pr-10 py-2 bg-gray-700 text-gray-200 rounded-md border border-gray-600 focus:outline-none focus:border-blue-500 w-[300px]"
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            <button
                type="submit"
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <Search className="w-5 h-5" />
            </button>
        </form>
    )
}
