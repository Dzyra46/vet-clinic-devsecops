'use client';

import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { ArrowLeft, Calendar, Syringe, Pill, FileText, Dog, Cat, Bird } from 'lucide-react';

interface OwnerPetViewProps {
  patientId: string;
  onBack: () => void;
}

// Mock data
const mockPatientData: Record<string, any> = {
  '1': {
    name: 'Max',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 5,
    owner: 'John Smith',
    status: 'treatment',
    lastVisit: '2025-10-10',
    records: [
      {
        id: 'h1',
        date: '2025-10-10',
        type: 'visit',
        title: 'Ear Infection Treatment',
        description: 'Diagnosed with bacterial ear infection. Prescribed antibiotic drops for 2 weeks.',
        veterinarian: 'Dr. Emily Watson',
        nextVisit: '2025-10-24'
      },
      {
        id: 'h2',
        date: '2025-08-15',
        type: 'vaccination',
        title: 'Annual Vaccinations',
        description: 'Rabies and DHPP vaccines administered.',
        veterinarian: 'Dr. Michael Chen'
      },
      {
        id: 'h3',
        date: '2025-05-20',
        type: 'visit',
        title: 'Wellness Checkup',
        description: 'Routine examination, all parameters normal.',
        veterinarian: 'Dr. Emily Watson'
      }
    ]
  },
  '2': {
    name: 'Luna',
    species: 'cat',
    breed: 'Persian',
    age: 3,
    owner: 'Sarah Johnson',
    status: 'healthy',
    lastVisit: '2025-10-12',
    records: [
      {
        id: 'h4',
        date: '2025-10-12',
        type: 'visit',
        title: 'Annual Checkup',
        description: 'Complete physical examination, vaccinations updated.',
        veterinarian: 'Dr. Michael Chen'
      }
    ]
  },
  '3': {
    name: 'Charlie',
    species: 'dog',
    breed: 'Labrador',
    age: 7,
    owner: 'Mike Davis',
    status: 'treatment',
    lastVisit: '2025-10-14',
    records: [
      {
        id: 'h5',
        date: '2025-10-14',
        type: 'surgery',
        title: 'Dental Surgery',
        description: 'Professional cleaning and tooth extraction performed.',
        veterinarian: 'Dr. Sarah Martinez',
        nextVisit: '2025-11-14'
      }
    ]
  }
};

export function OwnerPetView({ patientId, onBack }: OwnerPetViewProps) {
  const patient = mockPatientData[patientId];

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <div className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Patient not found</p>
            <Button onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const getSpeciesIcon = (species: string) => {
    switch (species) {
      case 'dog':
        return <Dog className="w-6 h-6" />;
      case 'cat':
        return <Cat className="w-6 h-6" />;
      case 'bird':
        return <Bird className="w-6 h-6" />;
      default:
        return <Dog className="w-6 h-6" />;
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'visit':
        return <Calendar className="w-4 h-4" />;
      case 'vaccination':
        return <Syringe className="w-4 h-4" />;
      case 'prescription':
        return <Pill className="w-4 h-4" />;
      case 'surgery':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'visit':
        return 'bg-blue-100 text-blue-800';
      case 'vaccination':
        return 'bg-green-100 text-green-800';
      case 'prescription':
        return 'bg-purple-100 text-purple-800';
      case 'surgery':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🐾</span>
              </div>
              <span className="text-xl">PetCare Clinic</span>
            </div>
            <Button variant="secondary" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Pet Information Card */}
        <Card className="mb-6">
          <div className="pt-6">
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 text-4xl">
                  {getSpeciesIcon(patient.species)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-1">{patient.name}</h1>
                    <p className="text-gray-600">{patient.breed}</p>
                  </div>
                  <Badge className={getStatusColor(patient.status)}>
                    {patient.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p>{patient.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Owner</p>
                    <p>{patient.owner}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Visit</p>
                    <p>{new Date(patient.lastVisit).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Medical Records */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Medical Records</h2>
          <div className="space-y-4">
            {patient.records.map((record: any) => (
              <Card key={record.id}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between border-b pb-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        {getTypeIcon(record.type)}
                        {record.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(record.date).toLocaleDateString()} • {record.veterinarian}
                      </p>
                    </div>
                    <Badge className={getTypeColor(record.type)}>
                      {record.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-600">{record.description}</p>
                    {record.nextVisit && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Next visit scheduled: {new Date(record.nextVisit).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <Card className="bg-blue-50 border-blue-200">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Need Help or Have Questions?</h3>
            <p className="text-gray-600 mb-4">
              Contact us if you have questions about your pet's health or records.
            </p>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="font-medium">Phone:</span> (555) 123-4567
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium">Email:</span> contact@petcareclinic.com
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
