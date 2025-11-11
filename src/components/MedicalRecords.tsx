'use client';

import { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import { Search, FileText, Calendar } from 'lucide-react';
import { Button } from './ui/Button';

interface MedicalRecord {
  id: string;
  patientName: string;
  ownerName: string;
  date: string;
  diagnosis: string;
  treatment: string;
  nextVisit?: string;
  status: 'completed' | 'ongoing' | 'scheduled';
}

// Sementara tetap mock (belum ada API khusus medical-records)
const mockRecords: MedicalRecord[] = [
  {
    id: '1',
    patientName: 'Max',
    ownerName: 'John Smith',
    date: '2025-10-10',
    diagnosis: 'Ear Infection',
    treatment: 'Antibiotic drops, 2 weeks',
    nextVisit: '2025-10-24',
    status: 'ongoing'
  },
  {
    id: '2',
    patientName: 'Luna',
    ownerName: 'Sarah Johnson',
    date: '2025-10-12',
    diagnosis: 'Annual Checkup',
    treatment: 'Vaccinations updated, health certificate issued',
    status: 'completed'
  },
  {
    id: '3',
    patientName: 'Charlie',
    ownerName: 'Mike Davis',
    date: '2025-10-14',
    diagnosis: 'Dental Cleaning',
    treatment: 'Professional cleaning, tooth extraction (molar)',
    nextVisit: '2025-11-14',
    status: 'ongoing'
  },
  {
    id: '4',
    patientName: 'Rocky',
    ownerName: 'David Wilson',
    date: '2025-10-15',
    diagnosis: 'ACL Repair Surgery',
    treatment: 'Successful ACL reconstruction surgery, post-op recovery monitoring, pain management, physical therapy scheduled',
    nextVisit: '2025-10-22',
    status: 'ongoing'
  }
];

export function MedicalRecords() {
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<MedicalRecord[]>(mockRecords);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>(mockRecords);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredRecords(
      records.filter(r => {
        const matchText = r.patientName.toLowerCase().includes(q) ||
          r.ownerName.toLowerCase().includes(q) ||
          r.diagnosis.toLowerCase().includes(q);
        const matchStatus = statusFilter === 'all' || r.status === statusFilter;
        return matchText && matchStatus;
      })
    );
  }, [searchQuery, statusFilter, records]);

  const counts = {
    all: records.length,
    ongoing: records.filter(r => r.status === 'ongoing').length,
    completed: records.filter(r => r.status === 'completed').length,
    scheduled: records.filter(r => r.status === 'scheduled').length
  };

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold">Medical Records</h1>
        <div className="flex flex-wrap gap-3 text-xs">
          <span className="px-2 py-1 rounded bg-gray-100">All: {counts.all}</span>
          <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">Ongoing: {counts.ongoing}</span>
          <span className="px-2 py-1 rounded bg-green-100 text-green-700">Completed: {counts.completed}</span>
          <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">Scheduled: {counts.scheduled}</span>
        </div>
        <p className="text-gray-500 text-xs">Mock data sementara — akan diganti sumber data nyata.</p>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search patient / owner / diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 text-xs">
          {['all','ongoing','completed','scheduled'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full border transition ${statusFilter === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>


      <div className="grid gap-4">
        {filteredRecords.map((record) => (
          <Card key={record.id} className="hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b pb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    <span>{record.patientName}</span>
                    <span className="text-gray-400">/</span>
                    <span className="font-normal text-sm text-blue-600">{record.diagnosis}</span>
                  </h3>
                  <p className="text-xs text-gray-500">Owner: {record.ownerName}</p>
                </div>
                <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
              </div>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Visit Date</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{new Date(record.date).toLocaleDateString(undefined,{ day:'2-digit', month:'short', year:'numeric'})}</span>
                    </div>
                  </div>
                  {record.nextVisit && (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Next Visit</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{new Date(record.nextVisit).toLocaleDateString(undefined,{ day:'2-digit', month:'short', year:'numeric'})}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Treatment</p>
                  <p className={`text-sm leading-relaxed ${expanded[record.id] ? '' : 'line-clamp-3'}`}>{record.treatment}</p>
                  <button
                    type="button"
                    onClick={() => toggleExpand(record.id)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {expanded[record.id] ? 'Show less' : 'Show more'}
                  </button>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" className="text-xs">View Full</Button>
                  <Button variant="primary" className="text-xs">New Correction</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">No medical records found</p>
        </div>
      )}
    </div>
  );
}