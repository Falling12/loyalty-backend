'use client'
import React from 'react'

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="max-w-md w-full p-8 bg-gray-800 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-center text-white mb-4">Access Denied</h2>
                <p className="text-center text-gray-400">
                    New administrators can only be created by existing administrators.
                </p>
            </div>
        </div>
    )
}
