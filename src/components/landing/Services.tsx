'use client';

import { Card } from '../ui/Card';

const services = [
  { title: 'Health Check', desc: 'Comprehensive exams and wellness checks', icon: '🩺' },
  { title: 'Vaccination', desc: 'Keep your pets protected with up-to-date vaccines', icon: '💉' },
  { title: 'Surgery', desc: 'Safe and professional surgical procedures', icon: '🔪' },
];

export default function Services() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((s) => (
        <Card key={s.title} className="p-6 text-center hover:shadow-xl transition">
          <div className="flex items-center justify-center mx-auto w-16 h-16 rounded-full bg-blue-600 text-white text-2xl mb-4">
            {s.icon}
          </div>
          <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
          <p className="text-gray-600">{s.desc}</p>
        </Card>
      ))}
    </div>
  );
}