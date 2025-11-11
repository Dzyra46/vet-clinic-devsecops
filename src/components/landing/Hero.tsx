'use client';

import { Button } from '../ui/Button';

export default function Hero() {
  return (
    <section id="home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Image on the left for large screens */}
        <div className="w-full lg:w-1/2">
          <div className="rounded-xl overflow-hidden shadow-lg bg-gray-200">
            <img
              src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=3c9a6e3e7d1f6e8d9c2a6ef6a9a6f0a6"
              alt="Veterinary care"
              className="object-cover w-full h-64 sm:h-80 lg:h-[520px]"
            />
          </div>
        </div>

        {/* Text content on the right */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            Caring for pets with
            <span className="text-blue-600"> compassion</span> and expertise
          </h1>
          <p className="mt-4 text-gray-600">Comprehensive veterinary care for your beloved animals — from routine checkups and vaccinations to advanced surgery and emergency care.</p>

          <div className="mt-6 flex items-center gap-4">
            <Button className="px-6 py-3 rounded-lg" onClick={() => (window.location.href = '/login')}>
              Staff Login
            </Button>
            <a href="#services" className="text-sm text-gray-700 hover:text-blue-600">Explore services</a>
          </div>
        </div>
      </div>
    </section>
  );
}