'use client';

import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Sidebar } from '@/components/Sidebar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';

interface StatsCard {
  title: string;
  value: number;
  icon: string;
  change?: number | null;
  loading?: boolean;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<StatsCard[]>([
    { title: 'Total Patients', value: 0, icon: '🐾', change: null, loading: true },
    { title: 'Active Doctors', value: 0, icon: '👨‍⚕️', change: null, loading: true },
    { title: 'Pending Corrections', value: 0, icon: '📝', change: null, loading: true },
    { title: 'Medical Records', value: 0, icon: '📋', change: null, loading: true },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'admin') {
      router.push('/login');
    }

    fetchDashboardStats();
  }, [user, router]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch all stats in parallel
      const [patientsRes, doctorsRes, correctionsRes, recordsRes] = await Promise.all([
        fetch('/api/patients', { credentials: 'include' }).catch(() => null),
        fetch('/api/doctors', { credentials: 'include' }).catch(() => null),
        fetch('/api/corrections', { credentials: 'include' }).catch(() => null),
        fetch('/api/medical-records', { credentials: 'include' }).catch(() => null),
      ]);

      const patientsData = patientsRes?.ok ? await patientsRes.json() : { patients: [] };
      const doctorsData = doctorsRes?.ok ? await doctorsRes.json() : { doctors: [] };
      const correctionsData = correctionsRes?.ok ? await correctionsRes.json() : { corrections: [] };
      const recordsData = recordsRes?.ok ? await recordsRes.json() : { records: [] };

      // Count pending corrections
      const pendingCorrections = correctionsData.corrections?.filter(
        (c: any) => c.status === 'pending'
      ).length || 0;

      // Update stats - change is null (won't be displayed)
      // If you have historical data API, you can calculate change here
      setStats([
        {
          title: 'Total Patients',
          value: patientsData.patients?.length || 0,
          icon: '🐾',
          change: null, // Set to null if no historical data
          loading: false,
        },
        {
          title: 'Active Doctors',
          value: doctorsData.doctors?.length || 0,
          icon: '👨‍⚕️',
          change: null,
          loading: false,
        },
        {
          title: 'Pending Corrections',
          value: pendingCorrections,
          icon: '📝',
          change: null,
          loading: false,
        },
        {
          title: 'Medical Records',
          value: recordsData.records?.length || 0,
          icon: '📋',
          change: null,
          loading: false,
        },
      ]);

    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
      
      // Set loading to false even on error
      setStats(prev => prev.map(stat => ({ ...stat, loading: false })));
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}! Overview of your clinic.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-4xl opacity-50">
                  {stat.icon}
                </div>
                <div className="p-6">
                  <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">{stat.title}</h3>
                  {stat.loading ? (
                    <div className="mt-2 flex items-center">
                      <Loader className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <>
                      <p className="text-3xl font-bold mt-2 text-gray-900">{stat.value}</p>
                      {/* Only show change if it's not null */}
                      {stat.change !== null && stat.change !== undefined && (
                        <div className={`mt-2 text-sm felx items-center ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          <span className="mr-1">{stat.change >= 0 ? '↑' : '↓'}</span>
                          {Math.abs(stat.change)} from last month
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer hover:bg-gray-50">
                <div
                  className="flex items-center gap-4"
                  onClick={() => router.push('/admin/add-patient')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && router.push('/admin/add-patient')}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">🐾</div>
                  <div>
                    <h3 className="font-semibold">Add Patient</h3>
                    <p className="text-sm text-gray-600">Register new pet patient</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer hover:bg-gray-50">
                <div
                  className="flex items-center gap-4"
                  onClick={() => router.push('/admin/generate-qr')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && router.push('/admin/generate-qr')}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">📱</div>
                  <div>
                    <h3 className="font-semibold">Generate QR Code</h3>
                    <p className="text-sm text-gray-600">Create QR codes for patients</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer hover:bg-gray-50">
                <div
                  className="flex items-center gap-4"
                  onClick={() => router.push('/admin/doctors')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && router.push('/admin/doctors')}
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">👨‍⚕️</div>
                  <div>
                    <h3 className="font-semibold">Add Doctor</h3>
                    <p className="text-sm text-gray-600">Register new doctor</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mt-8">
            <Card className="overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                {loading ? (
                  <div className="text-center py-8">
                    <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                    <p className="text-gray-600 mt-2">Loading activities...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4 py-2">
                      <p className="text-sm text-gray-600">Dashboard loaded</p>
                      <p className="text-gray-900">Viewing current statistics</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4 py-2">
                      <p className="text-sm text-gray-600">System Status</p>
                      <p className="text-gray-900">All services operational</p>
                    </div>
                    {stats[2].value > 0 && (
                      <div className="border-l-4 border-yellow-500 pl-4 py-2">
                        <p className="text-sm text-gray-600">Attention Required</p>
                        <p className="text-gray-900">
                          {stats[2].value} pending correction{stats[2].value > 1 ? 's' : ''} awaiting review
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
}
