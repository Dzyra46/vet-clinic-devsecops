'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import QrScanner from '@/components/landing/QrScanner';
import { Heart, Shield, Clock, Award, LogIn, QrCode } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

export default function PublicLandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header with Staff Login */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🐾</span>
              </div>
              <span className="text-xl font-semibold">PetCare Clinic</span>
            </div>
            <Button onClick={() => router.push('/login')}>
              Staff Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero + Scanner Split Section */}
      <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row gap-12">
        {/* Left: Marketing / Intro */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            Manage & Access <span className="text-blue-600">Pet Medical Records</span> Seamlessly
          </h1>
          <p className="text-lg text-gray-600 max-w-prose">
            A unified platform for veterinarians, administrators, and pet owners. Secure, auditable, and fast.
          </p>
          <div className="rounded-2xl overflow-hidden shadow-lg border">
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200&q=80"
                alt="Veterinarian examining a pet"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        {/* Right: Scanner */}
        <div className="flex-1">
          <QrScanner />
        </div>
      </div>

      {/* Feature Cards (now positioned below hero & scanner, above services) */}
      <div className="container mx-auto px-4 pb-16">
        <h2 className="text-center text-3xl font-bold mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-white shadow-sm border flex items-start gap-3">
            <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-sm">
              <p className="font-semibold">Compassionate Care</p>
              <p className="text-gray-500">Patient-first workflows</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-white shadow-sm border flex items-start gap-3">
            <div className="w-10 h-10 rounded-md bg-green-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-sm">
              <p className="font-semibold">Secure & Audited</p>
              <p className="text-gray-500">Every action logged</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-white shadow-sm border flex items-start gap-3">
            <div className="w-10 h-10 rounded-md bg-purple-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-sm">
              <p className="font-semibold">24/7 Access</p>
              <p className="text-gray-500">Cloud-based availability</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-white shadow-sm border flex items-start gap-3">
            <div className="w-10 h-10 rounded-md bg-orange-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-sm">
              <p className="font-semibold">Pro-grade Tools</p>
              <p className="text-gray-500">Designed for clinics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Cards (simplified) */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold mb-12">Clinic Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[{
              title: 'Wellness Exams',
              desc: 'Preventive care & health optimization',
              img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80'
            },{
              title: 'Diagnostics',
              desc: 'Fast, accurate lab & imaging',
              img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80'
            },{
              title: 'Surgery & Recovery',
              desc: 'Modern sterile surgical suites',
              img: 'https://images.unsplash.com/photo-1628407187695-51e3f4446b42?w=600&q=80'
            }].map(s => (
              <div key={s.title} className="bg-white rounded-xl border shadow-sm hover:shadow-md transition overflow-hidden">
                <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                  <ImageWithFallback src={s.img} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="p-5 space-y-2">
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-sm text-gray-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 PetCare Veterinary Clinic. All rights reserved.</p>
          <p className="mt-2">📞 (555) 123-4567 | 📧 info@petcare.com</p>
        </div>
      </footer>
    </div>
  );
}