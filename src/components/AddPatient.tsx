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
  age: string; // disimpan sebagai string lalu dikonversi saat submit
  weight: string; // sama seperti age
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
        owner: formData.ownerName,
        contact: formData.ownerPhone,
        lastVisit: new Date().toISOString().slice(0,10),
        status: 'healthy',
        medicalCondition: ''
      };

      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Gagal menambah patient');
      }

  toast.success('Patient berhasil ditambahkan');
      setFormData({
        petName: '', species: '', breed: '', age: '', weight: '', color: '', ownerName: '', ownerEmail: '', ownerPhone: '', ownerAddress: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            <UserPlus className="w-6 h-6" />
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
          <Card title="Pet Information" className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <PawPrint className="w-5 h-5" />
              <h3 className="font-semibold">Pet Details</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                label="Pet Name"
                name="petName"
                value={formData.petName}
                onChange={handleChange}
                placeholder="e.g., Max, Luna"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Species <span className="text-red-500">*</span>
                </label>
                <select
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select species</option>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="rabbit">Rabbit</option>
                  <option value="hamster">Hamster</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <FormInput
                label="Breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder="e.g., Golden Retriever, Persian"
              />

              <FormInput
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age in years"
                min="0"
              />

              <FormInput
                label="Weight (kg)"
                name="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g., 15.5"
                min="0"
              />

              <FormInput
                label="Color/Markings"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g., Brown, White with black spots"
              />
            </div>
            <div className="mt-4 border-t pt-4 grid md:grid-cols-3 gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400" /> Required fields marked *</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-400" /> Use metric units (kg)</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-400" /> Keep details accurate</div>
            </div>
          </Card>

          {/* Owner Information */}
          <Card title="Owner Information" className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4 text-green-600">
              <User className="w-5 h-5" />
              <h3 className="font-semibold">Owner Details</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                label="Owner Name"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="e.g., John Smith"
                required
              />

              <FormInput
                label="Email"
                name="ownerEmail"
                type="email"
                value={formData.ownerEmail}
                onChange={handleChange}
                placeholder="e.g., john@example.com"
                required
              />

              <FormInput
                label="Phone Number"
                name="ownerPhone"
                type="tel"
                value={formData.ownerPhone}
                onChange={handleChange}
                placeholder="e.g., +62 812 3456 7890"
                required
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
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

            <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400" /> Pastikan nomor telepon aktif</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-400" /> Email digunakan untuk notifikasi</div>
            </div>
          </Card>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="min-w-[150px]"
          >
            {isSubmitting ? 'Saving...' : 'Add Patient'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              if (confirm('Are you sure you want to reset the form?')) {
                setFormData({
                  petName: '',
                  species: '',
                  breed: '',
                  age: '',
                  weight: '',
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