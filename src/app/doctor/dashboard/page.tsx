'use client';

import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Sidebar } from '@/components/Sidebar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Patient {
  id: number;
  name: string;
  type: string;
  lastVisit: string;
  status: 'healthy' | 'treatment' | 'critical';
}

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'doctor') {
      router.push('/login');
    }
  }, [user, router]);

  const todayPatients: Patient[] = [
    { id: 1, name: 'Max', type: 'Dog - Golden Retriever', lastVisit: '10:00 AM', status: 'healthy' },
    { id: 2, name: 'Luna', type: 'Cat - Persian', lastVisit: '11:30 AM', status: 'treatment' },
    { id: 3, name: 'Charlie', type: 'Dog - Beagle', lastVisit: '2:00 PM', status: 'healthy' },
    { id: 4, name: 'Milo', type: 'Cat - Siamese', lastVisit: '3:30 PM', status: 'critical' },
  ];

  const stats = [
    { title: "Today's Patients", value: '12', icon: '🐾', color: 'bg-blue-100 text-blue-700' },
    { title: 'Pending Records', value: '5', icon: '📋', color: 'bg-yellow-100 text-yellow-700' },
    { title: 'Critical Cases', value: '2', icon: '⚠️', color: 'bg-red-100 text-red-700' },
    { title: 'Completed Today', value: '8', icon: '✅', color: 'bg-green-100 text-green-700' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-700';
      case 'treatment': return 'bg-yellow-100 text-yellow-700';
      case 'critical': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!user || user.role !== 'doctor') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600">Welcome back, Dr. {user.name}! Here's your overview for today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center text-2xl`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Today's Patients */}
        <Card className="overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Patients</h2>
            <div className="space-y-4">
              {todayPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {patient.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-600">{patient.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-sm text-gray-600">{patient.lastVisit}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="text-4xl mb-2">📋</div>
              <h3 className="font-semibold text-gray-900">New Medical Record</h3>
              <p className="text-sm text-gray-600 mt-1">Create a new patient record</p>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="text-4xl mb-2">🔍</div>
              <h3 className="font-semibold text-gray-900">Search Patients</h3>
              <p className="text-sm text-gray-600 mt-1">Find patient history</p>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="text-4xl mb-2">📅</div>
              <h3 className="font-semibold text-gray-900">Review Tasks</h3>
              <p className="text-sm text-gray-600 mt-1">Review pending records and follow-ups</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
