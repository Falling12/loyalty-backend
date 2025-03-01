'use client'

import { Button } from '../ui/button'

type Props = {
    userId: string
}

export function GenerateQRButton({ userId }: Props) {
    const handleGenerateQR = async () => {
        try {
            const response = await fetch('/api/qr/admin/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) throw new Error('Failed to generate QR code');

            // Refresh the page to show new QR code
            window.location.reload();
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
    };

    return (
        <Button
            variant="primary"
            onClick={handleGenerateQR}
        >
            Generate QR Code
        </Button>
    );
}
