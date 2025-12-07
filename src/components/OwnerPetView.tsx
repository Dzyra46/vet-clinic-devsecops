'use client';

import React, { useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { ArrowLeft, Calendar, Syringe, Pill, FileText, Dog, Cat, Bird, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'path';

interface OwnerPetViewProps {
  patientId: string;
  onBack: () => void;
}

interface Patient {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  birth_date: string;
  owner: string;
  contact: string;
  owner_email: string;
  status: string;
  qr_code: string;
  created_at: string;
}

interface MedicalRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  species: string;
  doctor_id: string;
  doctor_name: string;
  specialization: string;
  visit_date: string;
  diagnosis: string;
  treatment: string;
  medication: string;
  notes: string | null;
  next_visit: string | null;
  blockchain_hash: string | null;
  created_at: string;
}

export function OwnerPetView({ patientId, onBack }: OwnerPetViewProps) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [corrections, setCorrections] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatientData();
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/public/patients/${patientId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Patient not found');
        }
          throw new Error('Failed to load patient data');
      }

      const data = await response.json();
      setPatient(data.patient);
      setRecords(data.medicalRecords || []);

      try {
        const correctionsRes = await fetch(`/api/public/corrections?patient_id=${patientId}&status=approved`);
        if (correctionsRes.ok) {
          const correctionsData = await correctionsRes.json();
          setCorrections(correctionsData.corrections || []);
        }
      } catch (correctionsError) {
        console.error('Failed to load corrections:', correctionsError);
      } // Don't fail the whole request if corrections fail

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patient data');
      toast.error('Failed to load patient information');
    } finally {
      setLoading(false);
    }
  };

  const getSpeciesIcon = (species: string) => {
    const lowerSpecies = species?.toLowerCase() || '';
    switch (lowerSpecies) {
      case 'dog':
        return <Dog className="w-6 h-6" />;
      case 'cat':
        return <Cat className="w-6 h-6" />;
      default:
        return <Dog className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    const lowerStatus = status?.toLowerCase() || '';
    switch (lowerStatus) {
      case 'sick':
        return 'bg-red-100 text-red-800';
      case 'under-treatment':
        return 'bg-blue-100 text-blue-800';
      case 'recovered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
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

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <div className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{error || 'Patient not found'}</p>
            <Button onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🐾</span>
              </div>
              <span className="text-xl font-semibold">PetCare Clinic</span>
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
                <span className="text-blue-700">
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
                    <p className="font-medium">{patient.age ? `${patient.age} years` : '-'} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Owner</p>
                    <p className="font-medium">{patient.owner}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="font-medium">{patient.contact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Species</p>
                    <p className="font-medium capitalize">{patient.species}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Birth Date</p>
                    <p className="font-medium">{formatDate(patient.birth_date)}</p>
                  </div>
                  {patient.owner_email && (
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-sm">{patient.owner_email}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Medical Records */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Medical Records</h2>
          {records.length === 0 ? (
            <Card>
              <div className="py-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No medical records found for this pet.</p>
              </div>
            </Card>
          ) : (
          <div className="space-y-4">
            {records.map((record: any) => (
              <Card key={record.id}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between border-b pb-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Visit Date: {formatDate(record.visit_date)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Doctor: {record.doctor_name} {record.specialization && `(${record.specialization})`}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold mb-1 text-gray-700">Diagnosis</p>
                      <p className="font-medium">{record.diagnosis}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-1 text-gray-700">Treatment</p>
                      <p className="font-medium">{record.treatment}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-1 text-gray-700">
                        <Pill className="w-4 h-4 inline mr-1" /> Medication
                      </p>
                      <p className="font-medium">{record.medication}</p>
                    </div>
                    {record.notes && (
                      <div>
                        <p className="text-sm font-semibold mb-1 text-gray-700">Notes</p>
                        <p className="text-gray-600">{record.notes}</p>
                      </div>
                    )}
                    {record.next_visit && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-800">
                          <Calendar className="w-4 h-4 inline mr-2" /> Next Visit scheduled: {formatDate(record.next_visit)}
                        </p>
                      </div>
                    )}
                    {/* ADDED: Show correction history */}
                    {corrections
                      .filter(c => c.record_id === record.id)
                      .map(correction => (
                        <div key={correction.id} className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Medical Record Updated
                          </p>
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="font-medium">Field Corrected:</span> {correction.field}
                            </p>
                            <p>
                              <span className="font-medium">Updated Value:</span>{' '}
                              <span className="text-green-700 font-semibold">
                                {correction.proposed_value}
                              </span>
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                              Reason: {correction.reason}
                            </p>
                            <p className="text-xs text-gray-500">
                              Updated on {new Date(correction.decided_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}</div>

        {/* Contact Information */}
        <Card className="bg-blue-50 border-blue-200">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Need Help or Have Questions?</h3>
            <p className="text-gray-600 mb-4">
              Contact us if you have questions about your pet's health or records.
            </p>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="font-medium">Phone:</span> (021) 1234567
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
