import { prisma } from '@/lib/auth';
import { SettingsForm } from '../components/forms/settings-form';
import { updateSettings } from '../actions/settings';

export default async function SettingsPage() {
  const initialData = await prisma.settings.findFirst();

  const handleSubmit = async ({ appIconUrl, backgroundImageUrl }: { appIconUrl: string; backgroundImageUrl: string }) => {
    "use server"

    await updateSettings(appIconUrl, backgroundImageUrl);
  }

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">Settings</h1>
        <SettingsForm 
          initialAppIconUrl={initialData?.appIconUrl || ""} 
          initialBackgroundImageUrl={initialData?.backgroundImageUrl || ""} 
          onSubmit={handleSubmit} 
        />
      </div>
    </div>
  );
}
