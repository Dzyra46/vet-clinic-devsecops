'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';

interface StatsCard {
  title: string;
  value: number;
  icon: string;
  change: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Redirect to role-specific dashboard
    if (user.role === 'admin' && !window.location.pathname.includes('/admin')) {
      router.push('/admin/dashboard');
    } else if (user.role === 'doctor' && !window.location.pathname.includes('/doctor')) {
      router.push('/doctor/dashboard');
    }
  }, [user, router]);

  const stats: StatsCard[] = [
    {
      title: 'Total Patients',
      value: 256,
      icon: '🐾',
      change: 12,
    },
    {
      title: 'Active Doctors',
      value: 8,
      icon: '👨‍⚕️',
      change: 2,
    },
    {
      title: 'Pending Corrections',
      value: 5,
      icon: '�',
      change: 1,
    },
    {
      title: 'Medical Records',
      value: 1205,
      icon: '📋',
      change: 28,
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userRole={user.role} />
      <div className="flex">
        {(user.role === 'admin' || user.role === 'doctor') && (
          <Sidebar />
        )}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's an overview of your clinic.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-3xl">
                  {stat.icon}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">{stat.title}</h3>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  <div className={`mt-2 text-sm ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change >= 0 ? '+' : ''}{stat.change} from last month
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Recent Activity Section */}
          <div className="mt-8">
            <Card className="overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <div className="mt-4 space-y-4">
                  {/* Add your activity items here */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="text-sm text-gray-600">Today at 10:30 AM</p>
                    <p className="text-gray-900">Correction request approved for Rex (Golden Retriever)</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="text-sm text-gray-600">Today at 9:15 AM</p>
                    <p className="text-gray-900">Medical record updated for Luna (Persian Cat)</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <p className="text-sm text-gray-600">Yesterday at 4:45 PM</p>
                    <p className="text-gray-900">New patient registered: Max (German Shepherd)</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}