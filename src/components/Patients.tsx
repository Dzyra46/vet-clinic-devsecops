import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Search, Dog, Cat, Bird, Edit, Trash2, PawPrint } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/Avatar';
import { toast } from 'sonner';

interface Patient {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed: string;
  age: number;
  owner: string;
  contact: string;
  lastVisit?: string;
  status: 'healthy' | 'under-treatment' | 'critical';
  qrCode?: string;
  weights?: number;
}

export function Patients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch patients on component mount
  useEffect(() => {
    fecthPatients();
  }, []);

  // Fetch all patients from API
  const fecthPatients = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/patients', {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch patients');
      }

      const data = await res.json();
      setPatients(data.patients || []);
    } catch (error: any) {
      console.error('Error fetching patients:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load patients');
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.species.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSpeciesIcon = (species: string) => {
    switch (species) {
      case 'dog':
        return <Dog className="w-5 h-5" />;
      case 'cat':
        return <Cat className="w-5 h-5" />;
      default:
        return <Dog className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'treatment':
        return 'bg-blue-100 text-blue-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format status text
  const formatStatusText = (status: string) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
      }, 100); // Ganti titik setiap 100ms

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Patients</h1>
        <p className="text-gray-600">Manage all registered patients</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by patient name, owner, breed or species..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-6 flex gap-3 text-sm">
        <span className="px-3 py-1 rounded bg-blue-100 text-blue-800">Total Patients: {patients.length}</span>
        <span className="px-3 py-1 rounded bg-green-100 text-green-800">
          Healthy: {patients.filter(p => p.status === 'healthy').length}</span>
        <span className="px-3 py-1 rounded bg-blue-100 text-blue-800">
          Under Treatment: {patients.filter(p => p.status === 'under-treatment').length}</span>
        <span className="px-3 py-1 rounded bg-red-100 text-red-800">
          Critical: {patients.filter(p => p.status === 'critical').length}</span>
      </div>

      {/* Patients Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 bg-blue-100">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {getSpeciesIcon(patient.species)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <p className="text-sm text-gray-500">{patient.breed}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(patient.status)}>
                  {formatStatusText(patient.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Species</span>
                  <span className="text-sm">{patient.species}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Age</span>
                  <span className="text-sm">{patient.age ? `${patient.age} year${patient.age !== 1 ? 's' : ''}` : 'N/A'}</span>
                </div>
                {patient.weights && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Weight</span>
                    <span className="text-sm">{patient.weights} kg</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Owner</span>
                  <span className="text-sm">{patient.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Contact</span>
                  <span className="text-sm">{patient.contact}</span>
                </div>
                {patient.lastVisit && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Last Visit</span>
                    <span className="text-sm">{new Date(patient.lastVisit).toLocaleDateString()}</span>
                  </div>
                )}
                {patient.qrCode && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">QR Code</span>
                    <span className="text-sm">{patient.qrCode}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <Dog className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchQuery
              ? 'No patients match your search.'
              : 'No patients registered yet.'}
          </p>
          {searchQuery && (
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your search criteria.
            </p>
          )}
        </div>
      )}
    </div>
  );
}