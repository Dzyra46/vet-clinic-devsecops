'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { Lock, Shield, ArrowLeft } from 'lucide-react';

export default function PetVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qrCode = searchParams.get('qr');
  const patientId = searchParams.get('id');

  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      const res = await fetch('/api/password_verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, qrCode: qrCode || '', password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Verification failed');
      }

      const result = await res.json();
      toast.success('Access granted!');

      // Redirect to pet medical records
      router.push(`/pet/${patientId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed';
      toast.error(`❌ ${errorMessage}`);
      console.error('Verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  if (!patientId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <Card className="max-w-md w-full p-6 text-center">
          <p className="text-red-600">Invalid QR code. Please scan again.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Enter Your Password</h1>
          <p className="text-gray-600">
            To view your pet's medical records, please enter the password you set during registration.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isVerifying}
            className="w-full"
          >
            {isVerifying ? 'Verifying...' : 'Access Medical Records'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </form>
      </Card>
    </div>
  );
}