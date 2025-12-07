'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { Badge } from './ui/Badge';
import { Calendar, Syringe, Pill, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface Patient {
  id: string;
  name: string;
  species: string;
  breed: string;
}

interface MedicalRecord {
  id: string;
  visit_date: string;
  diagnosis: string;
  treatment: string;
  medication: string;
  doctor_name: string;
  patient_name: string;
  notes?: string;
  next_visit?: string;
  created_at: string;
}

export function PatientHistory() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      fetchMedicalRecords(selectedPatient);
    }
  }, [selectedPatient]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/patients');
      
      if (response.ok) {
        const data = await response.json();
        setPatients(data.patients || []);
        
        // Auto-select first patient
        if (data.patients && data.patients.length > 0) {
          setSelectedPatient(data.patients[0].id);
        }
      } else {
        toast.error('Failed to load patients');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Error loading patients');
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicalRecords = async (patientId: string) => {
    try {
      setLoadingRecords(true);
      const response = await fetch(`/api/medical-records?patient_id=${patientId}`);
      
      if (response.ok) {
        const data = await response.json();
        setMedicalRecords(data.records || []);
      } else {
        toast.error('Failed to load medical records');
      }
    } catch (error) {
      console.error('Error fetching medical records:', error);
      toast.error('Error loading medical records');
    } finally {
      setLoadingRecords(false);
    }
  };

  const getRecordType = (record: MedicalRecord): 'visit' | 'vaccination' | 'prescription' | 'surgery' => {
    const diagnosisLower = record.diagnosis?.toLowerCase() || '';
    const treatmentLower = record.treatment?.toLowerCase() || '';
    const medicationLower = record.medication?.toLowerCase() || '';  // Added this
    
    if (diagnosisLower.includes('vaccin') || treatmentLower.includes('vaccin')) {
      return 'vaccination';
    }
    if (diagnosisLower.includes('surgery') || treatmentLower.includes('surgery') || diagnosisLower.includes('operation')) {
      return 'surgery';
    }
    if (medicationLower.includes('prescription') || medicationLower.includes('medication')) {  // Changed condition
      return 'prescription';
    }
    return 'visit';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'visit':
        return <Calendar className="w-4 h-4" />;
      case 'vaccination':
        return <Syringe className="w-4 h-4" />;
      case 'medication':
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
      case 'medication':
        return 'bg-purple-100 text-purple-800';
      case 'surgery':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filterRecordsByType = (type: string) => {
    if (type === 'all') return medicalRecords;
    return medicalRecords.filter(record => getRecordType(record) === type);
  };

  const renderRecordCard = (record: MedicalRecord) => {
    const type = getRecordType(record);
    
    return (
      <Card key={record.id}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                {getTypeIcon(type)}
                {record.diagnosis}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {new Date(record.visit_date).toLocaleDateString()} • {record.doctor_name}
              </p>
            </div>
            <Badge className={getTypeColor(type)}>
              {type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Treatment:</p>
              <p>{record.treatment}</p>
            </div>
            {record.medication && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">medication:</p>
                <p className="text-sm">{record.medication}</p>
              </div>
            )}
            {record.notes && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Notes:</p>
                <p className="text-sm">{record.notes}</p>
              </div>
            )}
            {record.next_visit && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Next Visit:</p>
                <p className="text-sm">{new Date(record.next_visit).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Patient History</h1>
        <p className="text-muted-foreground">View complete medical history for patients</p>
      </div>

      <div className="mb-6">
        <label className="text-sm mb-2 block">Select Patient</label>
        {loading ? (
          <div className="text-sm text-gray-500">Loading patients...</div>
        ) : (
          <Select value={selectedPatient} onValueChange={setSelectedPatient}>
            <SelectTrigger className="w-full md:w-96">
              <SelectValue placeholder="Select a patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={`${patient.name} - ${patient.species} (${patient.breed})`} value={`${patient.name} - ${patient.species} (${patient.breed})`}>
                  {patient.name} - {patient.species} ({patient.breed})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {loadingRecords ? (
        <div className="text-center py-12 text-gray-500">Loading medical records...</div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Records ({medicalRecords.length})</TabsTrigger>
            <TabsTrigger value="visits">Visits ({filterRecordsByType('visits').length})</TabsTrigger>
            <TabsTrigger value="vaccinations">Vaccinations ({filterRecordsByType('vaccinations').length})</TabsTrigger>
            <TabsTrigger value="surgeries">Surgeries ({filterRecordsByType('surgeries').length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="space-y-4">
              {filterRecordsByType('all').map(renderRecordCard)}
            </div>
          </TabsContent>

          <TabsContent value="visits" className="mt-6">
            <div className="space-y-4">
              {filterRecordsByType('visits').map(renderRecordCard)}
            </div>
          </TabsContent>

          <TabsContent value="vaccinations" className="mt-6">
            <div className="space-y-4">
              {filterRecordsByType('vaccinations').map(renderRecordCard)}
            </div>
          </TabsContent>

          <TabsContent value="surgeries" className="mt-6">
            <div className="space-y-4">
              {filterRecordsByType('surgeries').map(renderRecordCard)}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {!loadingRecords && medicalRecords.length === 0 && selectedPatient && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No medical records found for this patient</p>
        </div>
      )}
    </div>
  );
}