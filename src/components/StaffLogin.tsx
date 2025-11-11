'use client';

// TODO: Paste kode StaffLogin dari Figma di sini
// Atau gunakan yang sudah ada di src/app/login/page.tsx

interface StaffLoginProps {
  onLogin?: (role: 'vet' | 'admin') => void;
  onBack?: () => void;
}

export function StaffLogin({ onLogin, onBack }: StaffLoginProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Staff Login</h1>
      <p className="text-gray-600 mt-2">Komponen ini akan diisi dengan kode dari Figma</p>
      <p className="text-sm text-gray-500 mt-4">
        Note: Mungkin bisa menggunakan komponen yang sudah ada di src/app/login/page.tsx
      </p>
    </div>
  );
}
