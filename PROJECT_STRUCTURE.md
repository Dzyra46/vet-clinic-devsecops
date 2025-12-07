# VetClinic Management System - Project Structure

## 📋 Informasi Proyek

**Nama**: VetClinic Management System  
**Framework**: Next.js 14 (App Router)  
**Bahasa**: TypeScript  
**Database**: Supabase (PostgreSQL)  
**Styling**: Tailwind CSS  
**Testing**: Jest  
**Versi**: 0.1.0
**Last Updated**: December 4, 2025

---

## 📁 Struktur Folder Lengkap

```
vet-clinic-management/
│
├── 📂 src/ # Source Code Utama
│ │
│ ├── 📂 app/ # Next.js App Router (Frontend + API)
│ │ │
│ │ ├── 📂 admin/ # Admin Dashboard Pages
│ │ │ ├── add-patient/ # Form tambah pasien baru
│ │ │ ├── corrections/ # Review permintaan koreksi
│ │ │ ├── dashboard/ # Admin dashboard utama
│ │ │ ├── doctors/ # Manajemen dokter
│ │ │ ├── generate-qr/ # Generate QR code untuk pasien
│ │ │ ├── logs/ # Audit logs viewer
│ │ │ ├── medical-records/ # Medical records management
│ │ │ └── patients/ # Manajemen pasien
│ │ │
│ │ ├── 📂 doctor/ # Doctor Dashboard Pages
│ │ │ ├── corrections/ # Submit permintaan koreksi
│ │ │ ├── dashboard/ # Doctor dashboard utama
│ │ │ ├── history/ # Riwayat kunjungan pasien
│ │ │ ├── medical-records/ # Input medical records
│ │ │ └── patients/ # List pasien dokter
│ │ │
│ │ ├── 📂 dashboard/ # Shared dashboard redirect
│ │ │ └── page.tsx
│ │ │
│ │ ├── 📂 login/ # Login page
│ │ │ └── page.tsx
│ │ │
│ │ ├── 📂 pet/ # Public pet view (QR scan result)
│ │ │ ├── page.tsx
│ │ │ └── verify/
│ │ │
│ │ ├── 📂 register-pet/ # Register pet form
│ │ │ └── page.tsx
│ │ │
│ │ ├── 📂 api/ # Backend API Routes
│ │ │ │
│ │ │ ├── 📂 auth/ # Authentication APIs
│ │ │ │ ├── route.ts # POST /api/auth/login
│ │ │ │ ├── route.ts # POST /api/auth/logout
│ │ │ │ └── route.ts # POST /api/auth/register
│ │ │ │
│ │ │ ├── 📂 audit-logs/ # Audit logs API
│ │ │ │ └── route.ts # GET, DELETE /api/audit-logs
│ │ │ │
│ │ │ ├── 📂 corrections/ # Correction requests API
│ │ │ │ └── route.ts # GET, POST, PATCH /api/corrections
│ │ │ │
│ │ │ ├── 📂 doctors/ # Doctors CRUD API
│ │ │ │ └── route.ts # GET, POST, PATCH, DELETE /api/doctors
│ │ │ │
│ │ │ ├── 📂 patients/ # Patients CRUD API
│ │ │ │ └── route.ts # GET, POST, PATCH, DELETE /api/patients
│ │ │ │
│ │ │ ├── 📂 medical-records/ # Medical records API
│ │ │ │ └── route.ts # GET, POST, PATCH, DELETE /api/medical-records
│ │ │ │
│ │ │ ├── 📂 doctor-stats/ # Doctor statistics API
│ │ │ │ └── route.ts # GET /api/doctor-stats
│ │ │ │
│ │ │ ├── 📂 public/ # Public APIs (no auth)
│ │ │ │ └── patients/
│ │ │ │ └── route.ts # GET pet info by QR code
│ │ │ │
│ │ │ ├── 📂 register-pet/ # Pet registration API
│ │ │ │ └── route.ts
│ │ │ │
│ │ │ ├── 📂 password_verification/ # Password utility
│ │ │ │ └── route.ts
│ │ │ │
│ │ │ ├── 📂 test-db/ # Database connection test
│ │ │ │ └── route.ts
│ │ │ │
│ │ │ └── 📂 test-password/ # Password hashing test
│ │ │ └── route.ts
│ │ │
│ │ ├── page.tsx # Landing page
│ │ ├── layout.tsx # Root layout
│ │ └── globals.css # Global styles
│ │
│ ├── 📂 server/ # Backend Business Logic
│ │ │
│ │ ├── 📂 models/ # Data Models (TypeScript interfaces)
│ │ │ ├── User.ts # User model
│ │ │ ├── Doctor.ts # Doctor model
│ │ │ ├── Patient.ts # Patient/Pet model
│ │ │ ├── MedicalRecord.ts # Medical record model
│ │ │ └── Correction.ts # Correction request model
│ │ │
│ │ ├── 📂 services/ # Business Logic Layer
│ │ │ ├── authService.ts        # Authentication & session management
│ │ │ ├── doctorService.ts      # Doctor CRUD operations
│ │ │ ├── patientService.ts     # Patient CRUD operations
│ │ │ ├── correctionService.ts  # Correction request workflow
│ │ │ └── test/                 # Service unit tests
│ │ │
│ │ └── README.md # Backend documentation
│ │
│ ├── 📂 components/ # React UI Components
│ │ │
│ │ ├── AddPatient.tsx # Form tambah pasien
│ │ ├── AuditLogs.tsx # Audit logs table
│ │ ├── Corrections.tsx # Correction requests UI
│ │ ├── DoctorManagement.tsx # Doctor management table
│ │ ├── MedicalRecords.tsx # Medical records form
│ │ ├── Navbar.tsx # Navigation bar
│ │ ├── OwnerPetView.tsx # Pet owner view component
│ │ ├── PatientHistory.tsx # Patient visit history
│ │ ├── Patients.tsx # Patients table
│ │ ├── PatientSelector.tsx # Patient dropdown selector
│ │ ├── QRGenerator.tsx # QR code generator
│ │ ├── Sidebar.tsx # Dashboard sidebar
│ │ │
│ │ ├── 📂 landing/ # Landing page components
│ │ │ ├── Hero.tsx # Hero section
│ │ │ ├── QrScanner.tsx # QR scanner component
│ │ │ └── Services.tsx # Services showcase
│ │ │
│ │ ├── 📂 figma/ # Figma-imported components
│ │ │ └── ImageWithFallback.tsx
│ │ │
│ │ ├── 📂 providers/ # React Context providers
│ │ │ └── ClientProviders.tsx
│ │ │
│ │ └── 📂 ui/ # Reusable UI primitives
│ │ ├── Avatar.tsx
│ │ ├── Badge.tsx
│ │ ├── Button.tsx
│ │ ├── Card.tsx
│ │ ├── FormInput.tsx
│ │ ├── Input.tsx
│ │ ├── LogoutButton.tsx
│ │ ├── Select.tsx
│ │ └── Tabs.tsx
│ │
│ ├── 📂 context/ # React Context (State Management)
│ │ └── AuthContext.tsx # Authentication context & RBAC
│ │
│ ├── 📂 lib/ # Utilities & Helpers
│ │ │
│ │ ├── auditLog.ts # Audit logging utilities
│ │ ├── errorHandler.ts # Error handling utilities
│ │ │
│ │ ├── 📂 auth/ # Authentication utilities
│ │ │ ├── middleware.ts # Auth middleware (withAuth, requireRole)
│ │ │ ├── password.ts # Password hashing (bcrypt)
│ │ │ └── session.ts # Session management
│ │ │
│ │ ├── 📂 supabase/ # Supabase clients
│ │ │ ├── client.ts # Client-side Supabase client
│ │ │ ├── server.ts # Server-side Supabase client
│ │ │ └── types.ts # Supabase type definitions
│ │ │
│ │ ├── 📂 validation/ # Input validation & sanitization
│ │ │ ├── validators.ts # Input validators (UUID, email, text, etc.)
│ │ │ ├── sanitizers.ts # XSS & SQL injection sanitizers
│ │ │ └── tests/ # Validation tests
│ │ │
│ │ ├── 📂 ratelimit/ # Rate limiting
│ │ │ ├── ratelimiter.ts # In-memory rate limiter
│ │ │ └── test/ # Rate limit tests
│ │ │
│ │ └── 📂 mappers/ # Data transformation mappers
│ │
│ ├── 📂 types/ # TypeScript type definitions
│ │ └── global.d.ts # Global type declarations
│ │
│ ├── 📂 assets/ # Static assets (images, icons)
│ │
│ ├── 📂 test/ # Root-level tests
│ │ └── security.test.ts # Security & OWASP tests
│ │
│ └── middleware.ts # Next.js middleware (route protection)
│
├── 📂 public/ # Static files
│ └── favicon.svg
│
├── 📂 coverage/ # Test coverage reports
│ ├── clover.xml
│ ├── coverage-final.json
│ ├── lcov.info
│ └── lcov-report/
│
├── 📂 .github/ # GitHub workflows & configs
│
├── 📂 .vscode/ # VS Code workspace settings
│
├── 📄 package.json # Dependencies & scripts
├── 📄 tsconfig.json # TypeScript configuration
├── 📄 next.config.js # Next.js configuration
├── 📄 tailwind.config.js # Tailwind CSS configuration
├── 📄 postcss.config.js # PostCSS configuration
├── 📄 jest.config.js # Jest test configuration
├── 📄 jest.setup.js # Jest setup file
├── 📄 jsconfig.json # JavaScript configuration
├── 📄 .eslintrc.json # ESLint configuration
├── 📄 .stylelintrc.json # Stylelint configuration
├── 📄 .gitignore # Git ignore rules
├── 📄 .env.example # Environment variables template
├── 📄 .env.local # Local environment (git-ignored)
├── 📄 .env.production # Production environment (git-ignored)
├── 📄 README.md # Project documentation
└── 📄 PROJECT_STRUCTURE.md # This file
```

---

## 🎯 Arsitektur Request Flow

### Authentication Flow

```
User Login Request
    ↓
[Frontend] /login/page.tsx
    ↓ POST /api/auth/login
[API Route] route.ts
    ↓ Rate limit check
[Lib] ratelimiter.ts
    ↓ Validate credentials
[Lib] password.ts (bcrypt verification)
    ↓ Query database
[Supabase] users table
    ↓ Create session
[Lib] session.ts
    ↓ Set HttpOnly cookie
[Middleware] middleware.ts
    ↓ Audit log
[Supabase] audit_logs table
    ↓ Redirect by role
[Context] AuthContext.tsx

```

### CRUD Flow (Example: Doctors Management)

```
[Frontend] DoctorManagement.tsx
    ↓ fetch('/api/doctors')
[API Route] route.ts
    ↓ Rate limit check (100 req/min)
[Lib] ratelimiter.ts
    ↓ Authentication check
[Lib] middleware.ts (withAuth)
    ↓ Authorization check (admin only)
[Lib] middleware.ts (requireRole)
    ↓ Input validation
[Lib] validators.ts
    ↓ Query database
[Supabase] doctors table
    ↓ Audit log
[Supabase] audit_logs table
    ↓ Return JSON response
[API Route] NextResponse.json()
    ↓ Update UI state
[Frontend] useState/useEffect

```

### Correction Workflow

```
Doctor submits correction request
    ↓
[Frontend] Corrections.tsx
    ↓ POST /api/corrections
[API Route] route.ts
    ↓ Validate input
[Lib] validators.ts
    ↓ Create correction record
[Supabase] corrections table (status: 'pending')
    ↓ Audit log
[Supabase] audit_logs table
    ↓ Notify admin (future: email/push)

---

Admin reviews & approves/rejects
    ↓
[Frontend] Corrections.tsx (admin view)
    ↓ PATCH /api/corrections { action: 'approve'/'reject' }
[API Route] route.ts
    ↓ Update correction status
[Supabase] corrections table
    ↓ If approved: update medical_records
[Supabase] medical_records table
    ↓ Audit log
[Supabase] audit_logs table
    ↓ Notify doctor (future)

```

### QR Code Scanner Flow (Public Access)

```
Pet Owner scans QR code
    ↓
[Frontend] landing/QrScanner.tsx
    ↓ Extract patient ID from QR
[Component] Parse QR data
    ↓ GET /api/public/patients/[id]
[API Route] route.ts
    ↓ No authentication required (public endpoint)
    ↓ Rate limit check (100 req/min)
[Lib] ratelimiter.ts
    ↓ Validate UUID
[Lib] validators.ts
    ↓ Query patient + medical records
[Supabase] patients, medical_records tables
    ↓ Return sanitized data
[API Route] NextResponse.json()
    ↓ Display pet info
[Frontend] OwnerPetView.tsx

```

---

## 🗃️ Database Schema (Supabase)

### Tables

1. **users** - User accounts

   - `id` (UUID, PK, default: uuid_generate_v4())
   - `name` (VARCHAR, NOT NULL)
   - `email` (unique)
   - `password_hash` (TEXT, NOT NULL)
   - `role` (VARCHAR, NOT NULL) - admin | doctor | pet-owner
   - `created_at`, `updated_at` (TIMESTAMPTZ, default: now())

2. **doctors** - Doctor profiles

   - `id` (UUID, PK, default: uuid_generate_v4())
   - `user_id` (UUID, NOT NULL, FK → users.id)
   - `specialization` (VARCHAR, NOT NULL)
   - `license_number` (VARCHAR, NOT NULL)
   - `phone` (VARCHAR, NOT NULL)
   - `status` (VARCHAR, NOT NULL, default: 'active') - active | inactive
   - `join_date` (DATE, NOT NULL, default: CURRENT_DATE)
   - `created_at`, `updated_at` (TIMESTAMPTZ, default: now())

3. **patients** - Pet patient records

   - `id` (UUID, PK, default: uuid_generate_v4())
   - `name` (VARCHAR, NOT NULL)
   - `species` (VARCHAR, NOT NULL) - dog | cat | other
   - `breed` (VARCHAR, NOT NULL)
   - `birth_date` (DATE, nullable)
   - `age` (FLOAT, nullable)
   - `weight` (FLOAT, nullable)
   - `owner_id` (UUID, NOT NULL, FK → users.id)
   - `owner` (VARCHAR, NOT NULL)
   - `contact` (VARCHAR, NOT NULL)
   - `qr_code` (VARCHAR, NOT NULL, unique)
   - `status` (VARCHAR, default: 'healthy') - healthy | under-treatment | recovered
   - `notes` (TEXT, nullable)
   - `created_at`, `updated_at` (TIMESTAMPTZ, default: now())

4. **medical_records** - Medical visit history

   - `id` (UUID, PK, default: uuid_generate_v4())
   - `patient_id` (UUID, NOT NULL, FK → patients.id)
   - `doctor_id` (UUID, NOT NULL, FK → doctors.id)
   - `visit_date` (DATE, NOT NULL, default: CURRENT_DATE)
   - `diagnosis` (TEXT, NOT NULL)
   - `treatment` (TEXT, NOT NULL)
   - `medication` (TEXT, NOT NULL)
   - `notes` (TEXT, nullable)
   - `next_visit` (DATE, nullable)
   - `weight` (FLOAT, nullable)
   - `blockchain_hash` (VARCHAR, nullable)
   - `blockchain_tx_id` (VARCHAR, nullable)
   - `created_at`, `updated_at` (TIMESTAMPTZ, default: now())

5. **corrections** - Correction requests

   - `id` (UUID, PK, default: uuid_generate_v4())
   - `record_id` (UUID, NOT NULL, FK → medical_records.id)
   - `doctor_id` (UUID, NOT NULL, FK → doctors.id)
   - `patient_id` (UUID, NOT NULL, FK → patients.id)
   - `patient_name` (VARCHAR, NOT NULL)
   - `doctor_name` (VARCHAR, NOT NULL)
   - `field` (VARCHAR, NOT NULL)
   - `current_value` (TEXT, NOT NULL)
   - `proposed_value` (TEXT, NOT NULL)
   - `reason` (TEXT, NOT NULL)
   - `status` (VARCHAR, NOT NULL, default: 'pending') - pending | approved | rejected
   - `decided_at` (TIMESTAMPTZ, nullable)
   - `decided_by` (VARCHAR, nullable)
   - `created_at`, `updated_at` (TIMESTAMPTZ, default: now())

6. **audit_logs** - System activity logs

   - `id` (UUID, PK, default: uuid_generate_v4())
   - `user_id` (UUID, nullable, FK → users.id)
   - `user_name` (VARCHAR, NOT NULL)
   - `user_role` (VARCHAR, NOT NULL)
   - `action` (VARCHAR, NOT NULL) - login | logout | create | update | delete | view | approve | reject
   - `resource` (VARCHAR, NOT NULL) - doctor | patient | medical_record | correction | audit_log
   - `details` (TEXT, NOT NULL)
   - `ip_address` (VARCHAR, nullable)
   - `status` (VARCHAR, NOT NULL, default: 'success') - success | failure
   - `timestamp` (TIMESTAMPTZ, default: now())

7. **sessions** - User sessions (optional, jika pakai session table)
   - `id` (UUID, PK, default: uuid_generate_v4())
   - `user_id` (UUID, NOT NULL, FK → users.id)
   - `token` (TEXT, NOT NULL)
   - `expires_at` (TIMESTAMPTZ, NOT NULL)
   - `created_at` (TIMESTAMPTZ, default: now())

### Database Views

Views untuk mempermudah query dengan JOIN:

1. **doctors_with_users** - Doctor data with user information (name, email)
2. **patients_with_owners** - Patient data with owner email
3. **medical_records_detailed** - Complete medical record with patient & doctor names

---

## 🔐 Security Features

### 1. **Authentication & Authorization**

- **Password hashing**: bcrypt (10 salt rounds) - `src/lib/auth/password.ts`
- **Session management**: HttpOnly cookies - `src/lib/auth/session.ts`
- **RBAC**: Role-based access control (admin, doctor, pet-owner) - `src/lib/auth/middleware.ts`
- **Route protection**: Next.js middleware - `src/middleware.ts`

### 2. **Input Validation & Sanitization**

- **Validators**: UUID, email, name, text field, enum - `src/lib/validation/validators.ts`
- **Sanitizers**: XSS protection, SQL injection prevention - `src/lib/validation/sanitizers.ts`
- **Comprehensive tests**: Security test suite - `src/__test__/security.test.ts`

### 3. **Rate Limiting**

- **In-memory rate limiter**: `src/lib/ratelimit/ratelimiter.ts`
- **Limits**:
  - Login: 5 attempts per 15 minutes
  - Register: 3 attempts per hour
  - API Read: 100 requests per minute
  - API Write: 30 requests per minute
- **Production**: Recommended upgrade to Redis-based rate limiting

### 4. **Audit Logging**

- **Complete activity tracking**: All actions logged to `audit_logs` table
- **Logged data**: timestamp, user, action, resource, status, IP address
- **Utilities**: `src/lib/auditLog.ts`
- **Admin access**: `/admin/logs`

### 5. **Error Handling**

- **Centralized error handler**: `src/lib/errorHandler.ts`
- **No sensitive data leakage**: Generic error messages to client
- **Detailed server logs**: Full error stack in server console

### 6. **CORS & HTTPS**

- **CORS**: Configured in API routes
- **HTTPS only**: Production deployment MUST use HTTPS

---

## 🧪 Testing

### Test Scripts

```bash
npm test                  # Run tests in watch mode
npm run test:coverage     # Generate coverage report
npm run test:security     # Run security tests only
npm run test:validation   # Run validation tests only
npm run test:ci           # Run tests in CI environment

```

## Dependencies

### Runtime Dependencies:

- Next.js ^14.0.1
- React ^18.2.0
- Supabase SSR ^0.7.0
- Supabase JS ^2.81.1
- bcrypt ^6.0.0
- qrcode ^1.5.4
- qrcode.react ^4.2.0
- html5-qrcode 2.3.8
- lucide-react ^0.553.0
- sonner ^2.0.7

### Dev Dependencies:

- TypeScript ^5.2.2
- Jest ^30.2.0
- Testing Library (React ^16.3.0, Jest-DOM ^6.9.1)
- Tailwind CSS ^3.3.5
- ESLint ^9.39.0
- bcrypt types, node types, etc.

---

## 🚀 Status Proyek

**Completed:**

- ✅ Backend service layer (AuthService, DoctorService, PatientService, CorrectionService)
- ✅ API Routes untuk semua resources
- ✅ Database schema setup (Supabase PostgreSQL - ACTIVE)
- ✅ Database views (doctors_with_users, patients_with_owners, medical_records_detailed)
- ✅ Authentication & session management
- ✅ Rate limiting & input validation
- ✅ Audit logging system
- ✅ RBAC (Role-Based Access Control)
- ✅ QR Code generation & scanning
- ✅ Correction workflow (doctor request → admin approval)
- ✅ Security testing suite

**In Progress:**

- ⏳ Frontend integration (beberapa komponen masih mock data)
- ⏳ Blockchain integration untuk medical records (DFD 3.1)

**Next Steps:**

1. Integrate all components with API endpoints
2. Implement real-time notifications (Supabase Realtime)
3. Add blockchain hashing for medical record integrity
4. Production deployment (Vercel + Supabase)
5. Performance optimization & caching

```

```
