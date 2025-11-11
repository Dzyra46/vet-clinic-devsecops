# Project Structure Overview

## 📁 Struktur Folder Lengkap

```
d:\Alfin\Semester 7\Devsecops\Tugas Besar\
│
├── 📂 src/
│   │
│   ├── 📂 app/                          # FRONTEND - Pages & Routing
│   │   ├── 📂 admin/                    # Admin role pages
│   │   │   ├── dashboard/
│   │   │   ├── doctors/
│   │   │   ├── patients/
│   │   │   ├── add-patient/
│   │   │   ├── generate-qr/
│   │   │   ├── corrections/             ✅ NEW
│   │   │   ├── logs/
│   │   │   └── settings/
│   │   │
│   │   ├── 📂 doctor/                   # Doctor role pages
│   │   │   ├── dashboard/
│   │   │   ├── patients/
│   │   │   ├── medical-records/
│   │   │   ├── history/
│   │   │   └── corrections/             ✅ NEW
│   │   │
│   │   ├── 📂 api/                      # BACKEND - API Routes
│   │   │   ├── 📂 auth/                 ✅ Authentication
│   │   │   │   ├── login/route.ts
│   │   │   │   └── logout/route.ts
│   │   │   │
│   │   │   ├── doctors/route.ts         ✅ NEW - Doctors CRUD
│   │   │   ├── patients/route.ts        ✅ NEW - Patients CRUD
│   │   │   └── corrections/route.ts     ✅ NEW - Corrections API
│   │   │
│   │   ├── page.tsx                     # Login page
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── 📂 server/                       # BACKEND - Business Logic
│   │   │
│   │   ├── 📂 models/                   # Data Models
│   │   │   ├── User.ts                  ✅ User model & mock data
│   │   │   ├── Doctor.ts                ✅ Doctor model & mock data
│   │   │   ├── Patient.ts               ✅ Patient model & mock data
│   │   │   ├── MedicalRecord.ts         ✅ Medical record model
│   │   │   └── Correction.ts            ✅ Correction request model
│   │   │
│   │   ├── 📂 services/                 # Business Logic
│   │   │   ├── authService.ts           ✅ Auth & session logic
│   │   │   ├── doctorService.ts         ✅ Doctor CRUD logic
│   │   │   ├── patientService.ts        ✅ Patient CRUD logic
│   │   │   └── correctionService.ts     ✅ Correction workflow logic
│   │   │
│   │   ├── 📂 middleware/               # Future: Auth, Validation
│   │   │
│   │   ├── 📂 database/                 # Future: Prisma setup
│   │   │
│   │   └── README.md                    # Backend documentation
│   │
│   ├── 📂 components/                   # FRONTEND - UI Components
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   ├── DoctorManagement.tsx
│   │   ├── Patients.tsx
│   │   ├── AddPatient.tsx
│   │   ├── MedicalRecords.tsx
│   │   ├── PatientHistory.tsx
│   │   ├── AuditLogs.tsx
│   │   ├── Corrections.tsx              ✅ NEW
│   │   ├── QRGenerator.tsx
│   │   ├── OwnerPetView.tsx
│   │   │
│   │   ├── 📂 landing/
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   └── QrScanner.tsx
│   │   │
│   │   └── 📂 ui/                       # UI primitives
│   │       ├── Card.tsx
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Badge.tsx
│   │
│   ├── 📂 context/                      # State Management
│   │   └── AuthContext.tsx
│   │
│   └── 📂 lib/                          # Utilities
│       └── auditLog.ts                  # Audit log helper
│
├── 📂 public/                           # Static assets
│
├── 📄 IMPLEMENTATION_DOCS.md            ✅ UPDATED
├── 📄 README.md
├── 📄 package.json
├── 📄 tsconfig.json
└── 📄 next.config.js
```

---

## 🎯 Arsitektur Request Flow

### Authentication Flow
```
User Login
    ↓
[Frontend] page.tsx
    ↓ POST /api/auth/login
[API Route] src/app/api/auth/login/route.ts
    ↓
[Service] authService.validateCredentials()
    ↓
[Model] User.ts (mock data)
    ↓
[Service] authService.createSessionResponse()
    ↓ Set HttpOnly Cookie
[Frontend] AuthContext → Redirect by role
```

### CRUD Flow (Example: Doctors)
```
[Frontend] DoctorManagement.tsx
    ↓ fetch('/api/doctors')
[API Route] src/app/api/doctors/route.ts
    ↓ GET handler
[Service] DoctorService.getAll()
    ↓
[Model] Doctor.ts (mock data array)
    ↓
[Service] Return doctors[]
    ↓
[API Route] NextResponse.json()
    ↓
[Frontend] Update state & render table
```

### Correction Workflow
```
Doctor submits correction
    ↓
[Frontend] Corrections.tsx
    ↓ POST /api/corrections
[API Route] src/app/api/corrections/route.ts
    ↓
[Service] CorrectionService.create()
    ↓
[Model] correctionRequests[] (mock)
    ↓ Add log entry
[Lib] auditLog.addLog()
    ↓
[Frontend] Refresh list

---

Admin reviews
    ↓
[Frontend] Corrections.tsx (admin view)
    ↓ PATCH /api/corrections { action: 'approve' }
[API Route] src/app/api/corrections/route.ts
    ↓
[Service] CorrectionService.approve()
    ↓
[Model] Update status in correctionRequests[]
    ↓ Add log entry
[Lib] auditLog.addLog()
    ↓
[Frontend] Refresh & show updated status
```

---

## 📊 Perbandingan SEBELUM vs SESUDAH

### ❌ SEBELUM (Unorganized)
```
Components menyimpan mock data sendiri-sendiri:
- DoctorManagement.tsx → const mockDoctors = [...]
- Patients.tsx → const mockPatients = [...]
- Corrections.tsx → const mockCorrections = [...]
- AuditLogs.tsx → const mockLogs = [...]

❌ Duplikasi logic
❌ Sulit di-test
❌ Coupling tinggi
❌ Tidak bisa reuse
```

### ✅ SESUDAH (Clean Architecture)
```
Struktur terorganisir:

📂 models/          → Data structure & mock data
📂 services/        → Business logic (reusable)
📂 api/             → HTTP handlers (thin layer)
📂 components/      → UI only (presentational)

✅ Separation of concerns
✅ Easy to test services
✅ Reusable logic
✅ Ready for real DB migration
✅ API-ready for mobile/external clients
```

---

## 🔄 Migration Path ke Real Database

### Step 1: Install Prisma
```bash
npm install prisma @prisma/client
npx prisma init
```

### Step 2: Define Schema
```prisma
// src/server/database/schema.prisma
model Doctor {
  id              String   @id @default(cuid())
  name            String
  email           String   @unique
  specialization  String
  licenseNumber   String
  phone           String
  status          String
  joinDate        DateTime
}
```

### Step 3: Update Services
```typescript
// SEBELUM (Mock)
export class DoctorService {
  static async getAll() {
    return doctors; // from mock array
  }
}

// SESUDAH (Prisma)
import { prisma } from '@/server/database/client';

export class DoctorService {
  static async getAll() {
    return await prisma.doctor.findMany();
  }
}
```

### Step 4: API Routes TIDAK PERLU DIUBAH! ✅
```typescript
// src/app/api/doctors/route.ts
// Tetap sama, karena service interface tidak berubah
export async function GET() {
  const doctors = await DoctorService.getAll();
  return NextResponse.json({ doctors });
}
```

---

## 🚀 Next Steps

1. ✅ **Struktur Backend** - DONE
2. ✅ **Services & Models** - DONE
3. ✅ **API Routes** - DONE
4. ✅ **Documentation** - DONE
5. ⏳ **Integrasi Frontend** - Components masih pakai local state
6. ⏳ **Setup Prisma** - Database migration
7. ⏳ **Blockchain Integration** - DFD 3.1

---

## 💡 Tips Development

### Cara Pakai API (Contoh)
```typescript
// Di component (future)
const fetchDoctors = async () => {
  const response = await fetch('/api/doctors');
  const { doctors } = await response.json();
  setDoctors(doctors);
};

// Create new doctor
const createDoctor = async (data) => {
  await fetch('/api/doctors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
};
```

### Testing Services
```typescript
// Easy to test karena tidak terikat HTTP
import { DoctorService } from '@/server/services/doctorService';

test('should get all doctors', async () => {
  const doctors = await DoctorService.getAll();
  expect(doctors).toBeArray();
});
```

---

**Author**: GitHub Copilot  
**Date**: November 11, 2025  
**Status**: ✅ Backend Structure Complete | ⏳ Frontend Integration Pending
