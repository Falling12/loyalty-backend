'use client'

import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from 'next/navigation'

function PaginationLink({ 
    href, 
    disabled, 
    children 
}: { 
    href: string, 
    disabled?: boolean, 
    children: React.ReactNode 
}) {
    const onClick = (e: React.MouseEvent) => {
        if (disabled) {
            e.preventDefault()
        }
    }

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`p-2 rounded-lg ${
                disabled
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : undefined}
        >
            {children}
        </Link>
    )
}

export function Pagination({
    currentPage,
    totalPages
}: {
    currentPage: number
    totalPages: number
}) {
    const searchParams = useSearchParams()
    
    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', page.toString())
        return `/?${params.toString()}`
    }

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // Show all pages if total is less than max
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Always include first page, current page, and last page
        pages.push(1);

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        // Add ellipsis if needed
        if (currentPage - 2 > 1) {
            pages.push('...');
        }

        // Add pages around current page
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Add ellipsis if needed
        if (currentPage + 2 < totalPages) {
            pages.push('...');
        }

        // Add last page if not already included
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="mt-8 flex items-center justify-center gap-2">
            <PaginationLink
                href={createPageUrl(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                <ChevronLeft className="w-5 h-5" />
            </PaginationLink>
            
            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => {
                    if (page === '...') {
                        return (
                            <span 
                                key={`ellipsis-${index}`} 
                                className="px-3 py-1 text-gray-500"
                            >
                                ...
                            </span>
                        );
                    }
                    return (
                        <Link
                            key={page}
                            href={createPageUrl(page as number)}
                            className={`px-3 py-1 rounded-md ${
                                currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                            }`}
                        >
                            {page}
                        </Link>
                    );
                })}
            </div>

            <PaginationLink
                href={createPageUrl(currentPage + 1)}
                disabled={currentPage >= totalPages}
            >
                <ChevronRight className="w-5 h-5" />
            </PaginationLink>
        </div>
    )
}
