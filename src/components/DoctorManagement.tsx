'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Search, UserPlus, Edit, Trash2, Stethoscope } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Emily Watson',
    email: 'doctor@vetclinic.com',
    phone: '+1-555-0101',
    specialization: 'General Practice',
    licenseNumber: 'VET-2020-001',
    status: 'active',
    joinDate: '2020-01-15'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@vetclinic.com',
    phone: '+1-555-0102',
    specialization: 'Surgery',
    licenseNumber: 'VET-2019-045',
    status: 'active',
    joinDate: '2019-03-10'
  },
  {
    id: '3',
    name: 'Dr. Sarah Martinez',
    email: 'sarah.martinez@vetclinic.com',
    phone: '+1-555-0103',
    specialization: 'Dental Care',
    licenseNumber: 'VET-2021-023',
    status: 'active',
    joinDate: '2021-06-01'
  }
];

export function DoctorManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: ''
  });

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoctor: Doctor = {
      id: String(doctors.length + 1),
      ...formData,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    };
    setDoctors([...doctors, newDoctor]);
    setShowAddModal(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialization: '',
      licenseNumber: ''
    });
  };

  const handleDeleteDoctor = (id: string) => {
    if (confirm('Are you sure you want to remove this doctor?')) {
      setDoctors(doctors.filter(d => d.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setDoctors(doctors.map(d => 
      d.id === id ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' } : d
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Doctor Management</h1>
        <p className="text-gray-600">Manage veterinarian accounts and information</p>
      </div>

      {/* Search and Add Button */}
      <div className="mb-6 flex gap-4">
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
        <Button onClick={() => setShowAddModal(true)}>
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
                    <td className="py-3 px-4 text-sm">{doctor.licenseNumber}</td>
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
                          onClick={() => toggleStatus(doctor.id)}
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
              <p className="text-gray-600">No doctors found</p>
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
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="doctor@vetclinic.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1-555-0000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Specialization</label>
                  <Input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="General Practice"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">License Number</label>
                  <Input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    placeholder="VET-2024-XXX"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Add Doctor
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowAddModal(false)}
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
