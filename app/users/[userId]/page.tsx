import { auth, prisma } from '@/lib/auth'
import { headers } from 'next/headers'
import Link from 'next/link'
import { 
    ArrowLeft,  
    Phone, 
    MapPin, 
    Shield, 
    Calendar,
    Clock,
    UserCircle,
    MessageSquare,
    BadgeAlert,
    UserCheck,
    IdCard,
    Wallet,
    Receipt,
    QrCode
} from 'lucide-react'
import React from 'react'
import { EditUserModal } from '../../components/users/edit-user-modal'
import { User } from '../../types/auth'
import { Button } from '../../components/ui/button'
import { GenerateQRButton } from '../../components/qr/generate-qr-button'
import { deleteQRCode } from '../../actions/qr'

type Props = {
    params: Promise<{ userId: string }>
}

const UserInfo = async ({ params }: Props) => {
    const userId = (await params).userId

    try {
        // Get user data with related records
        const [userResponse, transactions, qrCodes] = await Promise.all([
            auth.api.listUsers({
                query: {
                    filterField: 'id',
                    filterValue: userId
                },
                headers: await headers()
            }),
            prisma.transaction.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.qRCode.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' }
            })
        ])

        const userData = userResponse.users[0] as unknown as User

        if (!userData) {
            return (
                <div className="min-h-screen bg-gray-800 p-6">
                    <div className="bg-gray-900 rounded-lg p-8 text-center">
                        <p className="text-gray-400">User not found</p>
                    </div>
                </div>
            )
        }

        return (
            <div className="min-h-screen bg-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                    <Link 
                        href="/" 
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Users
                    </Link>
                    <EditUserModal user={userData} />
                </div>

                <div className="bg-gray-900 rounded-lg p-8">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-blue-300 text-2xl font-semibold">
                                {userData.name?.[0]?.toUpperCase() || '?'}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-100 mb-1">
                                { userData.name}
                            </h1>
                            <div className="flex items-center space-x-2">
                                <p className="text-gray-400">{userData.email}</p>
                                {userData.emailVerified ? (
                                    <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded">Verified</span>
                                ) : (
                                    <span className="text-xs bg-yellow-900/50 text-yellow-300 px-2 py-0.5 rounded">Unverified</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Basic Info */}
                        <div className="p-4 bg-gray-800 rounded-lg">
                            <h2 className="text-sm font-medium text-gray-400 mb-4">Basic Information</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <IdCard className="w-4 h-4 flex-shrink-0" />  
                                        User ID
                                    </p>
                                    <p className="text-gray-200 ml-6 break-all">{userData.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <Shield className="w-4 h-4 flex-shrink-0" />
                                        Role
                                    </p>
                                    <p className="text-gray-200 capitalize ml-6">{userData.role}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Phone Number
                                    </p>
                                    <p className="text-gray-200 ml-6">{userData.phoneNumber || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Location
                                    </p>
                                    <p className="text-gray-200 ml-6">{userData.location || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <Wallet className="w-4 h-4" />
                                        Balance
                                    </p>
                                    <p className="text-gray-200 ml-6">
                                        ${(userData.balance || 0).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Account Status */}
                        <div className="p-4 bg-gray-800 rounded-lg">
                            <h2 className="text-sm font-medium text-gray-400 mb-4">Account Status</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <UserCheck className="w-4 h-4" />
                                        Status
                                    </p>
                                    <div className="ml-6">
                                        {userData.banned ? (
                                            <div className="flex items-center space-x-2">
                                                <span className="text-red-400">Banned</span>
                                                {userData.banExpires && (
                                                    <span className="text-sm text-gray-400">
                                                        (until {new Date(userData.banExpires).toLocaleDateString()})
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-green-400">Active</span>
                                        )}
                                    </div>
                                </div>
                                {userData.banned === true && userData.banReason && (
                                    <div>
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <BadgeAlert className="w-4 h-4" />
                                            Ban Reason
                                        </p>
                                        <p className="text-red-400 ml-6">{userData.banReason}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Created At
                                    </p>
                                    <p className="text-gray-200 ml-6">
                                        {new Date(userData.createdAt).toLocaleDateString()} at{' '}
                                        {new Date(userData.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Last Updated
                                    </p>
                                    <p className="text-gray-200 ml-6">
                                        {new Date(userData.updatedAt).toLocaleDateString()} at{' '}
                                        {new Date(userData.updatedAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Information */}
                        <div className="p-4 bg-gray-800 rounded-lg md:col-span-2">
                            <h2 className="text-sm font-medium text-gray-400 mb-4">Profile Information</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <UserCircle className="w-4 h-4" />
                                        Display Name
                                    </p>
                                    <p className="text-gray-200 ml-6">{userData.displayName || 'Not set'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        Bio
                                    </p>
                                    <p className="text-gray-200 ml-6">{userData.bio || 'No bio provided'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Activity History */}
                        <div className="p-4 bg-gray-800 rounded-lg md:col-span-2">
                            <div className="mb-6">
                                <h2 className="text-sm font-medium text-gray-400 mb-4">Transaction History</h2>
                                {transactions.length > 0 ? (
                                    <div className="space-y-3">
                                        {transactions.map((transaction) => (
                                            <div 
                                                key={transaction.id} 
                                                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Receipt className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <p className="text-gray-200">
                                                            {transaction.type === 'ADD' ? 'Added' : 'Removed'}{' '}
                                                            <span className={transaction.type === 'ADD' ? 'text-green-400' : 'text-red-400'}>
                                                                ${Math.abs(transaction.amount).toFixed(2)}
                                                            </span>
                                                        </p>
                                                        <p className="text-sm text-gray-400">
                                                            {new Date(transaction.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-400">
                                                    by Admin ID: {transaction.adminId}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400">No transactions found</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-medium text-gray-400">QR Code History</h2>
                                    <GenerateQRButton userId={userId} />
                                </div>
                                {qrCodes.length > 0 ? (
                                    <div className="space-y-3">
                                        {qrCodes.map((qr) => (
                                            <div
                                                key={qr.id} 
                                                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <QrCode className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <p className="text-gray-200">
                                                            Code: {qr.code}
                                                            {qr.used && (
                                                                <span className="ml-2 text-xs bg-gray-600 text-gray-300 px-2 py-0.5 rounded">
                                                                    Used
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-gray-400">
                                                            Created: {new Date(qr.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <p className="text-sm text-gray-400">
                                                        Expires: {new Date(qr.expiresAt).toLocaleDateString()}
                                                    </p>
                                                    <form action={async () => {
                                                        'use server'
                                                        await deleteQRCode(qr.id, userId)
                                                    }}>
                                                        <Button 
                                                            type="submit"
                                                            variant="danger" 
                                                            size="sm"
                                                        >
                                                            Delete
                                                        </Button>
                                                    </form>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400">No QR codes found</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    } catch (error) {
        console.error('Error fetching user:', error)
        return (
            <div className="min-h-screen bg-gray-800 p-6">
                <div className="bg-gray-900 rounded-lg p-8 text-center">
                    <p className="text-gray-400">Error loading user details</p>
                </div>
            </div>
        )
    }
}

export default UserInfo