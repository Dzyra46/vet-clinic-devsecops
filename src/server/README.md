# Backend Structure Documentation

## Folder Structure

```
src/server/
├── models/              # Data models & mock data
│   ├── User.ts         # User model (admin, doctor, pet-owner)
│   ├── Doctor.ts       # Doctor model with specialization
│   ├── Patient.ts      # Patient (pet) model
│   ├── MedicalRecord.ts # Medical records model
│   └── Correction.ts   # Correction requests model
│
├── services/           # Business logic layer
│   ├── authService.ts      # Authentication & session management
│   ├── doctorService.ts    # Doctor CRUD operations
│   ├── patientService.ts   # Patient CRUD operations
│   └── correctionService.ts # Correction workflow logic
│
├── middleware/         # Request middleware (future)
│   └── (auth, validation, etc.)
│
└── database/          # Placeholder untuk koneksi database (future)
  └── (akan diisi saat tim mengaktifkan DB)
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login dengan email & password
- `POST /api/auth/logout` - Logout & clear session

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors?search={query}` - Search doctors
- `GET /api/doctors?status=active` - Filter by status
- `POST /api/doctors` - Create new doctor
- `PATCH /api/doctors` - Update doctor (body: {id, ...data})
- `DELETE /api/doctors?id={id}` - Delete doctor

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients?search={query}` - Search patients
- `GET /api/patients?status=healthy` - Filter by status
- `GET /api/patients?owner={name}` - Get by owner
- `POST /api/patients` - Create new patient
- `PATCH /api/patients` - Update patient (body: {id, ...data})
- `DELETE /api/patients?id={id}` - Delete patient

### Corrections
- `GET /api/corrections` - Get all correction requests
- `GET /api/corrections?status=pending` - Filter by status
- `GET /api/corrections?doctor={name}` - Filter by doctor
- `GET /api/corrections?search={query}` - Search corrections
- `POST /api/corrections` - Create correction request
- `PATCH /api/corrections` - Approve/reject (body: {id, action: 'approve'|'reject', decidedBy})

## Service Layer Pattern

Each service follows this pattern:

```typescript
export class XxxService {
  static async getAll(): Promise<Xxx[]>
  static async getById(id: string): Promise<Xxx | undefined>
  static async create(data: ...): Promise<Xxx>
  static async update(id: string, data: ...): Promise<Xxx | null>
  static async delete(id: string): Promise<boolean>
  static async search(query: string): Promise<Xxx[]>
  // ... custom methods
}
```

## Benefits

✅ **Separation of Concerns**
- Models: Data structure only
- Services: Business logic
- API Routes: HTTP handling (thin layer)

✅ **Reusability**
- Services can be called from anywhere
- Not tied to HTTP layer

✅ **Testability**
- Easy to unit test services
- Mock data in one place

✅ **Maintainability**
- Clear structure
- Easy to find code
- Easy to add features

## Migration Path

### Current State (Mock Data)
```typescript
// src/server/models/Doctor.ts
export const doctors: Doctor[] = [...]
```

### Future State (Database)
```typescript
// src/server/services/doctorService.ts
// Contoh (pseudo):
// import { db } from '@/server/database/client'
// export class DoctorService {
//   static async getAll() {
//     return await db.doctor.findMany()
//   }
// }
```

Only need to update **services** - API routes stay the same!

## Next Steps

1. ✅ Struktur folder created
2. ✅ Models created with mock data
3. ✅ Services created with business logic
4. ✅ API routes created (thin wrappers)
5. ⏳ Update components to use API (next)
6. ⏳ Aktifkan database (ORM/driver pilihan tim)
7. ⏳ Ganti operasi array di services menjadi query DB
