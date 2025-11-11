'use client';

import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { MedicalRecords } from '@/components/MedicalRecords';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DoctorMedicalRecordsPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'doctor') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'doctor') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1">
        <MedicalRecords />
      </main>
    </div>
  );
}
