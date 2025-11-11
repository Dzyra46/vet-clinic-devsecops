'use client';

import { OwnerPetView } from '@/components/OwnerPetView';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PetViewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const patientId = searchParams.get('id') || '1';

  const handleBack = () => {
    router.push('/');
  };

  return <OwnerPetView patientId={patientId} onBack={handleBack} />;
}
