'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Pencil, X } from 'lucide-react'
import { useState } from 'react'
import { EditUserForm } from '../forms/edit-user-form'
import { User } from '../../types/auth'

export function EditUserModal({ user }: { user: User }) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Pencil className="w-4 h-4" />
                    Edit User
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60" />
                <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-[450px] bg-gray-900 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <Dialog.Title className="text-xl font-semibold text-gray-100">
                            Edit User
                        </Dialog.Title>
                        <Dialog.Close className="text-gray-400 hover:text-gray-300">
                            <X className="w-4 h-4" />
                        </Dialog.Close>
                    </div>
                    <EditUserForm user={user} onSuccess={() => setOpen(false)} />
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
