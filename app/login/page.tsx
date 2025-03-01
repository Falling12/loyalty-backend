import LoginForm from './LoginForm'
import RegisterFirstAdmin from './RegisterFirstAdmin'
import { prisma } from '@/lib/auth';

async function hasAdminUser() {
  const users = await prisma.user.findMany({
    where: {
      role: 'admin'
    }
  })

  return {
    hasAdmin: users.length > 0
  }
}

export default async function LoginPage() {
  const { hasAdmin } = await hasAdminUser();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-xl">
        {!hasAdmin ? <RegisterFirstAdmin /> : <LoginForm />}
      </div>
    </div>
  )
}