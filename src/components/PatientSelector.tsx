'use client';

import { useState, useEffect } from 'react';
import { Input } from './ui/Input';
import { Search } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  species: string;
  owner: string;
}

interface PatientSelectorProps {
  onSelect: (patientId: string) => void;
  selectedId?: string;
}

export function PatientSelector({ onSelect, selectedId }: PatientSelectorProps) {
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    fetchPatients();
  }, [search]);

  useEffect(() => {
    if (selectedId && patients.length > 0) {
      const patient = patients.find(p => p.id === selectedId);
      if (patient) setSelectedPatient(patient);
    }
  }, [selectedId, patients]);

  const fetchPatients = async () => {
    try {
      const url = search 
        ? `/api/patients?search=${encodeURIComponent(search)}`
        : '/api/patients';
      
      const res = await fetch(url, { credentials: 'include' });
      const data = await res.json();
      setPatients(data.patients || []);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    }
  };

  const handleSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    onSelect(patient.id);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">
        Select Patient <span className="text-red-500">*</span>
      </label>
      
      {/* Display selected patient or search */}
      {selectedPatient && !isOpen ? (
        <div className="border rounded-md px-3 py-2 bg-gray-50 flex items-center justify-between">
          <div>
            <p className="font-medium">{selectedPatient.name}</p>
            <p className="text-xs text-gray-500">
              {selectedPatient.species} • Owner: {selectedPatient.owner}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setSelectedPatient(null);
            }}
            className="text-blue-600 text-sm hover:underline"
          >
            Change
          </button>
        </div>
      ) : (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search patient by name..."
              className="pl-10"
            />
          </div>

          {/* Dropdown results */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {patients.length === 0 ? (
                <div className="p-3 text-sm text-gray-500 text-center">
                  No patients found
                </div>
              ) : (
                patients.map((patient) => (
                  <button
                    key={patient.id}
                    type="button"
                    onClick={() => handleSelect(patient)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b last:border-b-0"
                  >
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-xs text-gray-500">
                      {patient.species} • Owner: {patient.owner}
                    </p>
                  </button>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}