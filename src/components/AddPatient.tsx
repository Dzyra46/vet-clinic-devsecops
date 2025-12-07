'use client';

import { useState } from 'react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { toast } from 'sonner';
import { FormInput } from './ui/FormInput';
import { UserPlus, PawPrint, User, Mail, Phone, MapPin } from 'lucide-react';

interface PatientFormData {
  petName: string;
  species: string;
  breed: string;
  age: string;
  weight: string;
  birthDate: string;
  color: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerAddress: string;
}

export function AddPatient() {
  const [formData, setFormData] = useState<PatientFormData>({
    petName: '',
    species: '',
    breed: '',
    age: '',
    weight: '',
    birthDate: '',
    color: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerAddress: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = (): string[] => {
    const issues: string[] = [];
    if (!formData.petName.trim()) issues.push('Pet Name wajib diisi');
    if (!formData.species) issues.push('Species wajib dipilih');
    if (!formData.ownerName.trim()) issues.push('Owner Name wajib diisi');
    if (!formData.ownerEmail.trim()) issues.push('Email pemilik wajib diisi');
    if (!formData.ownerPhone.trim()) issues.push('Phone pemilik wajib diisi');
    if (!formData.ownerAddress.trim()) issues.push('Address wajib diisi');
    if (formData.age && Number(formData.age) < 0) issues.push('Age tidak boleh negatif');
    if (formData.weight && Number(formData.weight) < 0) issues.push('Weight tidak boleh negatif');
    return issues;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  // clear toast-like state

    const issues = validate();
    if (issues.length) {
      setError(issues.join('\n'));
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: formData.petName,
        species: formData.species,
        breed: formData.breed,
        age: formData.age ? Number(formData.age) : 0,
        weight: formData.weight ? Number(formData.weight) : 0,
        birthDate: formData.birthDate || null,
        owner: formData.ownerName,
        ownerEmail: formData.ownerEmail, // Add this field
        contact: formData.ownerPhone,
        address: formData.ownerAddress,
        status: 'healthy',
        notes: ''
      };
``
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errData.error || `Error: ${res.status}`);
      }

  toast.success('Patient berhasil ditambahkan');
      setFormData({
        petName: '', species: '', breed: '', age: '', weight: '', birthDate: '', color: '', ownerName: '', ownerEmail: '', ownerPhone: '', ownerAddress: ''
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`);
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            <UserPlus className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-tight">Add New Patient</h1>
            <p className="text-gray-600 text-sm">Register a new pet and owner information</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700 whitespace-pre-line">
            {error}
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pet Information */}
          <Card className="md:col-span-2 p-6">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <PawPrint className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Pet Details</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <FormInput
                  label="Pet Name"
                  name="petName"
                  value={formData.petName}
                  onChange={handleChange}
                  placeholder="e.g., Max, Luna"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Species <span className="text-red-500">*</span>
                </label>
                <select
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                  required
                  aria-label="Species"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select species</option>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <FormInput
                  label="Breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  placeholder="e.g., Golden Retriever, Persian"
                  required
                />
              </div>

              <div className="space-y-1">
                <FormInput
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age in years"
                  min="0"
                  required
                />
              </div>

              <div className="space-y-1">
                <FormInput
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g., 15.5"
                  min="0"
                  required
                />
              </div>

              <div className="space-y-1">
                <FormInput
                  label="Birth Date"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                  placeholder="e.g., 2020-01-01"
                  required
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="space-y-1">
                <FormInput
                  label="Color/Markings"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="e.g., Brown, White with black spots"
                />
              </div>
            </div>
            <div className="mt-4 border-t pt-4 grid md:grid-cols-2 gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400" /> Required fields marked *</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-400" /> Keep details accurate</div>
            </div>
          </Card>

          {/* Owner Information */}
          <Card className="md:col-span-2 p-6">
            <div className="flex items-center gap-2 mb-4 text-green-600">
              <User className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Owner Details</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <FormInput
                  label="Owner Name"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="e.g., John Smith"
                  required
                />
              </div>

              <div className="space-y-1">
                <FormInput
                  label="Email"
                  name="ownerEmail"
                  type="email"
                  value={formData.ownerEmail}
                  onChange={handleChange}
                  placeholder="e.g., john@example.com"
                  required
                />
              </div>

              <div className="space-y-1">
                <FormInput
                  label="Phone Number"
                  name="ownerPhone"
                  type="tel"
                  value={formData.ownerPhone}
                  onChange={handleChange}
                  placeholder="e.g., +62 812 3456 7890"
                  required
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block text-base font-sm text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="ownerAddress"
                  value={formData.ownerAddress}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter complete address"
                />
              </div>
            </div>

            <div className="mt-4 border-t pt-4 grid md:grid-cols-3 gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400" /> Required fields marked *</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400" /> Number must be active </div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-400" /> Email will be used for notifications</div>
            </div>
          </Card>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? 'Saving...' : 'Add Patient'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="min-w-[120px]"
            onClick={() => {
              if (confirm('Are you sure you want to reset the form?')) {
                setFormData({
                  petName: '',
                  species: '',
                  breed: '',
                  age: '',
                  weight: '',
                  birthDate: '',
                  color: '',
                  ownerName: '',
                  ownerEmail: '',
                  ownerPhone: '',
                  ownerAddress: '',
                });
                toast.info('Form direset');
              }
            }}
          >
            Reset Form
          </Button>
        </div>
      </form>
    </div>
  );
}