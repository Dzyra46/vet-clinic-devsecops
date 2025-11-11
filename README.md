# VetClinic Management System

A modern veterinary clinic management system built with Next.js (App Router), React, TypeScript, Tailwind CSS — kini memakai backend service layer sederhana dengan data mock (tanpa database aktif). Setup Prisma dan migrasi database sengaja DITUNDA untuk dikerjakan oleh anggota tim lain.

## Features

### For Pet Owners
- 🔍 **QR Code Scanner** - Scan or upload your pet's QR code to instantly view medical records (no login required)
- 📱 **Mobile-Friendly** - Responsive design works on all devices
- 🏥 **Service Information** - View available veterinary services

### For Staff (Admin & Doctors)
- 👨‍⚕️ **Role-Based Dashboards** - Separate dashboards for Admin and Doctor roles
- 📊 **Statistics & Analytics** - View patient stats and activity (appointments removed per DFD scope)
- 🔐 **Secure Authentication** - Login system with role-based access control

## Tech Stack

- Framework: Next.js 14 (App Router)
- UI: React 18 + Tailwind CSS
- Language: TypeScript
- Database: BELUM diaktifkan (mock in-memory). Rencana penggunaan ORM (misal Prisma) diserahkan ke tim backend.
- Linting: ESLint (Next.js config)

## Getting Started (Teammate Quick Start)

### Prerequisites

Before you start, make sure you have installed:

- **Node.js** 18.17 or later ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for cloning) ([Download here](https://git-scm.com/))

To check if installed:
```bash
node --version  # Should show v18.17 or higher
npm --version   # Should show 9.x or higher
git --version   # Should show installed version
```

### Installation

#### Option 1: Clone from Git Repository (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd "Tugas Besar"
```

2. Install dependencies:
```bash
npm install

# If first time, copy .env and ensure DATABASE_URL is set (see below)
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

#### Option 2: Download ZIP File

1. Extract the downloaded ZIP file

2. Open terminal/command prompt in the extracted folder

3. Install dependencies:
```bash
npm install
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Important Notes

⚠️ **Do NOT copy `node_modules` or `.next` folders!** These will be regenerated when you run `npm install`.

✅ Only commit/share:
- `src/` (source)
- `public/` (assets)
- `prisma/` (schema & migrations)
- Config files (package.json, tsconfig.json, tailwind.config.js, prisma.config.ts, etc.)
- `.env.example` (if provided) — never commit real secrets
- README.md / docs

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── prisma/ (draft / boleh dihapus jika tidak pakai Prisma)
│   ├── schema.prisma (jika dipertahankan)
│   └── migrations/ (kosong)
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── admin/
│   │   ├── doctor/
│   │   ├── api/                    # API Routes (thin) → call services
│   │   │   ├── auth/
│   │   │   ├── doctors/route.ts
│   │   │   ├── patients/route.ts
│   │   │   └── corrections/route.ts
│   │   └── page.tsx
│   ├── server/                     # Backend logic (source of truth)
│   │   ├── models/                 # Data models (TS interfaces)
│   │   ├── services/               # Business logic (saat ini memakai mock arrays)
│   │   ├── middleware/             # Future: auth/validation
│   │   └── database/               # Placeholder (belum ada ORM)
│   ├── components/                 # UI components
│   │   ├── Corrections.tsx         # Updated to use API
│   │   ├── AuditLogs.tsx           # Uses local storage store
│   │   └── ui/
│   ├── context/                    # AuthContext (RBAC)
│   └── lib/                        # Utilities
│       └── auditLog.ts
├── .env                            # DATABASE_URL & other secrets (do not commit)
├── prisma.config.ts
└── package.json
```

## Status Integrasi Database

Saat ini: menggunakan data mock di `src/server/models/*`. Tidak ada koneksi database.

Jika tim ingin melanjutkan dengan database:
1. Pilih teknologi (Prisma / Drizzle / Sequelize / raw SQL)
2. Buat skema sesuai kebutuhan (boleh mulai dari draft `prisma/schema.prisma` jika dipertahankan)
3. Implementasi akses data: ubah isi service (misal `doctorService.ts`) dari operasi array ke query database
4. Tambah layer `database/` untuk inisialisasi client
5. Tambahkan seeding awal (opsional) untuk user admin & contoh dokter/pasien

Catatan: API routes sudah tipis dan siap menerima perubahan internal service tanpa perubahan endpoint.

## Features & Routes

### Public Routes (No Login Required)
- `/` - Landing page with QR code scanner
- `/login` - Staff login page
- `/register` - Staff registration page

### Protected Routes (Login Required)
- `/admin/dashboard` - Admin dashboard
- `/doctor/dashboard` - Doctor dashboard
- `/admin/corrections` - Admin correction review
- `/doctor/corrections` - Doctor correction requests

## Authentication

### Test Credentials

**Admin:**
- Email: `admin@vetclinic.com`
- Password: `admin123`

**Doctor:**
- Email: `doctor@vetclinic.com`
- Password: `doctor123`

Note: Current auth is for development only (mock users, cookie-based session). For production, implement proper hashing (bcrypt/argon2), JWT or NextAuth, and server-side guards.

## API Endpoints (current)

- Auth
	- POST `/api/auth/login`
	- POST `/api/auth/logout`
- Doctors
	- GET/POST/PATCH/DELETE `/api/doctors`
- Patients
	- GET/POST/PATCH/DELETE `/api/patients`
- Corrections
	- GET/POST/PATCH `/api/corrections`

Example fetch in a component:
```ts
const res = await fetch('/api/doctors');
const { doctors } = await res.json();
```

## QR Code Scanner

The landing page includes a QR code scanner feature that allows pet owners to:
1. Upload or scan their pet's QR code
2. View pet information instantly (name, owner, visit history)
3. No account creation or login required

## Development

### Available Scripts

- `npm run dev`   - Start development server
- `npm run build` - Build for production
- `npm start`     - Start production server
- `npm run lint`  - Run ESLint

### Code Style

This project uses:
- ESLint for code linting
- TypeScript for type safety
- Tailwind CSS for styling

## Status & Next Steps (for teammates)

Current status:
- Backend service layer created (`src/server/services/*`) and API routes wired.
- Corrections component now uses API; other components still use mock data.
- Database belum aktif (mock). Tim bebas memilih ORM / solusi persistence.

Next steps to continue:
1. Decide database option and run migrations (see Backend Setup above).
2. Update components to use API instead of local mock data:
	- `DoctorManagement.tsx` (GET/POST/PATCH/DELETE /api/doctors)
	- `Patients.tsx`, `AddPatient.tsx` (use /api/patients)
	- `MedicalRecords.tsx`, `PatientHistory.tsx` (to be backed by API)
3. (Opsional) Migrasikan service layer ke database pilihan tim.
4. Harden authentication (password hashing, server-side guards, possibly NextAuth).
5. Optional: Move audit logs from localStorage to DB (`AuditLog` model exists).

## Contributing (Team Workflow)

Branching:
- `main` → stable
- `dev`  → integration
- Feature: `feat/<feature-name>`
- Fix: `fix/<short-desc>`

Workflow:
1. Create branch from `dev`: `git checkout -b feat/<name>`
2. Commit small, meaningful changes
3. Run lint and (if applicable) `npx prisma migrate dev` when schema changes
4. Open PR to `dev` and request review
5. After approval, squash & merge

## License

This project is created for educational purposes.

## Contact

For questions or support, open an issue or contact the maintainers.

---

Built with ❤️ using Next.js and Tailwind CSS
# vet-clinic
