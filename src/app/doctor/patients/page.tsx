'use client';

import { Sidebar } from '@/components/Sidebar';
import { Patients } from '@/components/Patients';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DoctorPatientsPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/');
    } else if (user.role !== 'doctor') {
      router.replace(`/${user.role}/dashboard`);
    }
  }, [user, router]);

  if (!user || user.role !== 'doctor') {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Patients />
      </main>
    </div>
  );
}
