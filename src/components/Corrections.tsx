"use client";

import { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Input } from './ui/Input';
import React from 'react';
import { addLog } from '@/lib/auditLog';

// Simple textarea wrapper (since ./ui/Textarea doesn't exist yet)
interface SimpleTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
function Textarea(props: SimpleTextareaProps) {
  return <textarea className={"border rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 " + (props.className||'')} {...props} />;
}
import { Edit3, Check, X, Search } from 'lucide-react';

interface CorrectionRequest {
  id: string;
  recordId: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  field: string; // field to correct
  currentValue: string;
  proposedValue: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  decidedAt?: string;
  decidedBy?: string;
}


interface CorrectionsProps {
  role: 'admin' | 'doctor';
  doctorName?: string;
}

export function Corrections({ role, doctorName }: CorrectionsProps) {
  const [corrections, setCorrections] = useState<CorrectionRequest[]>([]);
  // Fetch corrections from API
  const fetchCorrections = async () => {
    let url = '/api/corrections';
    if (role === 'doctor' && doctorName) {
      url += `?doctor=${encodeURIComponent(doctorName)}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    setCorrections(data.corrections || []);
  };

  useEffect(() => {
    fetchCorrections();
  }, [role, doctorName]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CorrectionRequest['status']>('all');
  const [formData, setFormData] = useState({
    recordId: '',
    patientId: '',
    patientName: '',
    field: '',
    currentValue: '',
    proposedValue: '',
    reason: ''
  });

  const filtered = corrections.filter(c => {
    const matchesSearch =
      c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.recordId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a,b) => a.createdAt < b.createdAt ? 1 : -1);

  const getStatusColor = (status: CorrectionRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const submitCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      recordId: formData.recordId,
      patientId: formData.patientId,
      patientName: formData.patientName,
      field: formData.field,
      currentValue: formData.currentValue,
      proposedValue: formData.proposedValue,
      reason: formData.reason,
    };
    try {
      const res = await fetch('/api/corrections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to submit correction');
      }
      
      await fetchCorrections();
      setShowForm(false);
      setFormData({ recordId:'', patientId:'', patientName:'', field:'', currentValue:'', proposedValue:'', reason:'' });
    } catch (error) {
      console.error('Submit error:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit correction');
    }
  };

  const decide = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/corrections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id, 
          status,
        }),
        credentials: 'include'
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update correction');
      }
      
      await fetchCorrections();
    } catch (error) {
      console.error('Decide error:', error);
      alert(error instanceof Error ? error.message : 'Failed to update correction');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Medical Record Corrections</h1>
          <p className="text-gray-600">Workflow for requesting and approving corrections (DFD 3.2 & 3.3)</p>
        </div>
        {role === 'doctor' && (
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" /> Request Correction
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search patient, record, or ID"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          className="border rounded-md px-3 py-2 bg-white"
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <div className="flex items-center gap-2 text-sm">
          <Badge className="bg-yellow-100 text-yellow-800">Pending: {corrections.filter(c=>c.status==='pending').length}</Badge>
          <Badge className="bg-green-100 text-green-800">Approved: {corrections.filter(c=>c.status==='approved').length}</Badge>
          <Badge className="bg-red-100 text-red-800">Rejected: {corrections.filter(c=>c.status==='rejected').length}</Badge>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">ID</th>
                <th className="text-left py-2 px-3">Patient</th>
                <th className="text-left py-2 px-3">Field</th>
                <th className="text-left py-2 px-3">Current → Proposed</th>
                <th className="text-left py-2 px-3">Reason</th>
                <th className="text-left py-2 px-3">Status</th>
                <th className="text-left py-2 px-3">Timestamp</th>
                {role === 'admin' && <th className="text-left py-2 px-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium">{c.id}</td>
                  <td className="py-2 px-3">
                    <div className="flex flex-col">
                      <span>{c.patientName}</span>
                      <span className="text-xs text-gray-500">{c.patientId}</span>
                      <span className="text-xs text-gray-500">Record: {c.recordId}</span>
                      <span className="text-xs text-gray-500">By: {c.doctorName}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 capitalize">{c.field}</td>
                  <td className="py-2 px-3">
                    <div className="space-y-1">
                      <p className="text-xs line-through text-gray-500">{c.currentValue}</p>
                      <p className="text-xs font-semibold text-blue-700">{c.proposedValue}</p>
                    </div>
                  </td>
                  <td className="py-2 px-3 w-64">
                    <p className="text-xs text-gray-600 truncate" title={c.reason}>{c.reason}</p>
                  </td>
                  <td className="py-2 px-3">
                    <Badge className={getStatusColor(c.status)}>{c.status}</Badge>
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex flex-col">
                      <span>{c.createdAt}</span>
                      {c.decidedAt && <span className="text-xs text-gray-500">{c.decidedAt}</span>}
                    </div>
                  </td>
                  {role === 'admin' && (
                    <td className="py-2 px-3">
                      {c.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => decide(c.id,'approved')} className="text-green-600 hover:text-green-800" title="Approve">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => decide(c.id,'rejected')} className="text-red-600 hover:text-red-800" title="Reject">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-600">No correction requests found</div>
          )}
        </div>
      </Card>

      {/* Submit Form Modal */}
      {showForm && role === 'doctor' && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Edit3 className="w-5 h-5" /> New Correction Request
            </h2>
            <form onSubmit={submitCorrection} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium mb-1 block">Record ID</label>
                  <Input value={formData.recordId} onChange={e=>setFormData({...formData, recordId:e.target.value})} required placeholder="REC-1205" />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Patient ID</label>
                  <Input value={formData.patientId} onChange={e=>setFormData({...formData, patientId:e.target.value})} required placeholder="P-001" />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Patient Name</label>
                  <Input value={formData.patientName} onChange={e=>setFormData({...formData, patientName:e.target.value})} required placeholder="Max" />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Field To Correct</label>
                  <Input value={formData.field} onChange={e=>setFormData({...formData, field:e.target.value})} required placeholder="diagnosis" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium mb-1 block">Current Value</label>
                  <Textarea value={formData.currentValue} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>setFormData({...formData, currentValue:e.target.value})} required rows={2} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Proposed Value</label>
                  <Textarea value={formData.proposedValue} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>setFormData({...formData, proposedValue:e.target.value})} required rows={2} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Reason / Justification</label>
                <Textarea value={formData.reason} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>setFormData({...formData, reason:e.target.value})} required rows={3} placeholder="Explain why the change is needed" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1">Submit Request</Button>
                <Button type="button" variant="secondary" className="flex-1" onClick={()=>setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
