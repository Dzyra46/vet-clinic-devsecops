'use client';

import React, { useState, useEffect, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Search, UserPlus, Edit, Trash2, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';

interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  license_number: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

export function DoctorManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    license_number: '',
    password: '',
  });

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch all doctors from API
  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/doctors', {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch doctors');
      }
      
      const data = await res.json();
      setDoctors(data.doctors || []);
    } catch (error: any) {
      console.error('Error fetching doctors:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load doctors');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle add doctor form submission
  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (!formData.name || !formData.email || !formData.phone || !formData.specialization || !formData.license_number || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
    
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add doctor');
      }

      toast.success('Doctor added successfully');
      setShowAddModal(false);

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        license_number: '',
        password: '',
      });

      // Refresh doctor list
      await fetchDoctors();
    } catch (error: any) {
      console.error('Error adding doctor:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add doctor');
    }
  };

  // Handle delete doctor
  const handleDeleteDoctor = async (id: string) => {
    // Show confirmation dialog
    if (!confirm('Are you sure you want to remove this doctor? This action cannot be undone.')) {
      return;
    }

    // User confirmed, proceed with deletion
    try {
      const res = await fetch(`/api/doctors?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete doctor');
      }

      toast.success('Doctor deleted successfully');

      // Refresh doctor list
      await fetchDoctors();
    } catch (error: any) {
      console.error('Error deleting doctor:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete doctor');
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      const res = await fetch('/api/doctors/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      toast.success(`Doctor ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);

      // Refresh doctor list
      await fetchDoctors();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  // LoadingDots component
  const LoadingDots: React.FC = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
      const interval = setInterval(() => {
        setDots(prevDots => {
          if (prevDots.length >= 3) {
            return ''; // Reset ke 0 titik
          }
          return prevDots + '.'; // Tambah 1 titik
        });
      }, 200); // Ganti titik setiap 100ms

      // Cleanup function untuk membersihkan interval saat komponen dilepas
      return () => clearInterval(interval);
    }, []);

    // Catatan: Menggunakan &nbsp; (non-breaking space) memastikan lebar tidak goyang saat titik menghilang
    return (
      <span className="inline-block w-4 text-left text-gray-600">
        {dots}
        {/* Tambahkan spasi untuk mengisi ruang yang hilang saat titik kurang dari 3 */}
        {Array(3 - dots.length).fill('\u00A0').map((char, index) => (
          <React.Fragment key={index}>{char}</React.Fragment>
        ))}
      </span>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="mt-3 flex items-center text-gray-600">
            <span>Loading</span>
            <LoadingDots />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-5">
        <h1 className="text-3xl font-bold mb-2">Doctor Management</h1>
        <p className="text-gray-600">Manage veterinarian accounts and information</p>
      </div>

      {/* Search and Add Button */}
      <div className="mb-5 flex items-center gap-4 space-y-0 md:space-y-0 flex-col md:flex-row">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, email, or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="flex items-center gap-2" onClick={() => setShowAddModal(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Doctor
        </Button>
      </div>

      {/* Doctors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Doctors ({filteredDoctors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Contact</th>
                  <th className="text-left py-3 px-4">Specialization</th>
                  <th className="text-left py-3 px-4">License No.</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Join Date</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Stethoscope className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-sm text-gray-500">{doctor.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{doctor.phone}</td>
                    <td className="py-3 px-4">{doctor.specialization}</td>
                    <td className="py-3 px-4 text-sm">{doctor.license_number}</td>
                    <td className="py-3 px-4">
                      <Badge
                        className={
                          doctor.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {doctor.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(doctor.joinDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleStatus(doctor.id, doctor.status)}
                          className="text-blue-600 hover:text-blue-800"
                          title={doctor.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDoctor(doctor.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">{searchQuery ? 'No doctors found for your search.' : 'No doctors registered yet.'}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Doctor</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddDoctor} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name*</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email*</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="doctor@vetclinic.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone*</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+62-823-1234-5678"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Specialization*</label>
                  <Input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="General Practice"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">License Number*</label>
                  <Input
                    type="text"
                    value={formData.license_number}
                    onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                    placeholder="VET-2024-XXX"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password*</label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min. 8 characters, uppercase, number, special character"
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must contain uppercase, lowercase, number, and special character.
                  </p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Add Doctor
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowAddModal(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        specialization: '',
                        license_number: '',
                        password: '',
                      });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
