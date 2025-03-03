import { prisma } from '@/lib/auth'
import Link from 'next/link'
import { Plus, MapPin, Clock, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/button'
import Image from 'next/image'

export default async function FacilitiesPage() {
    const facilities = await prisma.facility.findMany({
        include: {
            images: {
                where: { isPrimary: true },
                take: 1
            }
        }
    })

    return (
        <div className="min-h-screen bg-gray-800 p-6">
            <div className='flex items-center justify-between mb-6'>
                <div className="flex flex-col gap-2">
                    <Link
                        href="/"
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-100">Facilities</h1>
                </div>
                <Link href="/facilities/new">
                    <Button className='flex items-center gap-2'>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Facility
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facilities.map((facility) => (
                    <Link
                        key={facility.id}
                        href={`/facilities/${facility.id}`}
                        className="bg-gray-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
                    >
                        <div className="h-48 bg-gray-800 relative">
                            {facility.images[0] ? (
                                <Image
                                    src={facility.images[0].url}
                                    alt={facility.images[0].alt || facility.name}
                                    className="w-full h-full object-cover"
                                    width={500}
                                    height={200}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-900/20">
                                    <span className="text-blue-300">No image</span>
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-100 mb-2">
                                {facility.name}
                            </h2>
                            <div className="space-y-2 text-gray-400">
                                <p className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {facility.address}
                                </p>
                                <p className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {facility.openTime} - {facility.closeTime}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
