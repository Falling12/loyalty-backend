import Link from "next/link"

interface PaginationLinkProps { 
    href: string
    disabled?: boolean
    children: React.ReactNode 
}

export function PaginationLink({ href, disabled, children }: PaginationLinkProps) {
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
