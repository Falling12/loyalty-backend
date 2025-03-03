'use client'

import { useState } from 'react';
import { ImageUpload } from '@/app/components/facilities/image-upload';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  appIconUrl: z.string(),
  backgroundImageUrl: z.string(),
});

interface SettingsFormProps {
  initialAppIconUrl: string;
  initialBackgroundImageUrl: string;
  onSubmit: ({appIconUrl, backgroundImageUrl}: { appIconUrl: string, backgroundImageUrl: string}) => void;
}

export function SettingsForm({ initialAppIconUrl, initialBackgroundImageUrl, onSubmit }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      appIconUrl: initialAppIconUrl,
      backgroundImageUrl: initialBackgroundImageUrl,
    },
  });

  const handleFormSubmit = async ({ appIconUrl, backgroundImageUrl }: { appIconUrl: string; backgroundImageUrl: string }) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      onSubmit({appIconUrl, backgroundImageUrl});
      setSuccess('Settings updated successfully');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      setError('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">App Icon</label>
        <ImageUpload
          maxImages={1}
          initialImages={initialAppIconUrl ? [initialAppIconUrl] : []}
          onChange={(urls) => setValue('appIconUrl', urls[0] || '')}
        />
        {errors.appIconUrl && <p className="text-sm text-red-500">{errors.appIconUrl.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">Background Image</label>
        <ImageUpload
          maxImages={1}
          initialImages={initialBackgroundImageUrl ? [initialBackgroundImageUrl] : []}
          onChange={(urls) => setValue('backgroundImageUrl', urls[0] || '')}
        />
        {errors.backgroundImageUrl && <p className="text-sm text-red-500">{errors.backgroundImageUrl.message}</p>}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-500">{success}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Update Settings'}
      </button>
    </form>
  );
}
