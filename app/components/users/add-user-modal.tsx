'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { AddUserForm } from '../forms/add-user-form'

export function AddUserModal() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add User
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60" />
                <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-[450px] bg-gray-900 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <Dialog.Title className="text-xl font-semibold text-gray-100">
                            Add New User
                        </Dialog.Title>
                        <Dialog.Close className="text-gray-400 hover:text-gray-300">
                            <X className="w-4 h-4" />
                        </Dialog.Close>
                    </div>
                    <AddUserForm onSuccess={() => setOpen(false)} />
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
