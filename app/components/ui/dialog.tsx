'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ReactNode } from 'react'

interface DialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    children: ReactNode
    trigger: ReactNode
}

export function Dialog({ open, onOpenChange, title, children, trigger }: DialogProps) {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <DialogPrimitive.Trigger asChild>
                {trigger}
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 bg-black/60" />
                <DialogPrimitive.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-[500px] bg-gray-900 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <DialogPrimitive.Title className="text-xl font-semibold text-gray-100">
                            {title}
                        </DialogPrimitive.Title>
                        <DialogPrimitive.Close className="text-gray-400 hover:text-gray-300">
                            <X className="w-4 h-4" />
                        </DialogPrimitive.Close>
                    </div>
                    {children}
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    )
}
