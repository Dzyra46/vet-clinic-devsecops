# VetClinic Management System

A modern veterinary clinic management system built with Next.js (App Router), React, TypeScript, Tailwind CSS, and Supabase (PostgreSQL). The system features a complete backend service layer with active database integration, role-based access control, and comprehensive security measures.

> 📚 **For detailed technical documentation**, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

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

### Backend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL) - **ACTIVE**
- **Authentication**: bcrypt + Session-based with HttpOnly cookies
- **Database Client**: Supabase JS Client SDK (@supabase/supabase-js)
- **Security**: Rate limiting, input validation, XSS/SQL injection protection

### Security Features

- **Rate Limiting**: In-memory rate limiter (production-ready with Redis recommendation)
  - Login: 5 attempts per 15 minutes
  - Register: 3 attempts per hour
  - API Read: 100 requests per minute
  - API Write: 30 requests per minute
- **Input Validation**: Comprehensive validators for email, name, UUID, enum, text fields
- **Input Sanitization**: XSS protection, SQL injection prevention
- **Password Security**: bcrypt hashing with salt rounds
- **RBAC**: Role-based access control (admin, doctor, pet-owner)
- **Audit Logging**: Complete activity tracking with Supabase storage
- **CORS**: Configured for production deployment

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

> 📌 **Note**: For complete folder structure and architecture diagrams, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## Database Configuration

Project ini menggunakan **Supabase** sebagai backend database (PostgreSQL).

### Database Tables

The system uses the following database tables:

- **users** - User accounts (admin, doctor, pet-owner)
- **doctors** - Doctor profiles with specialization
- **patients** - Pet patient records with QR codes
- **medical_records** - Complete medical visit history
- **corrections** - Medical record correction workflow
- **audit_logs** - System activity tracking
- **sessions** - User session management

### Database Views

For optimized queries, the following views are available:

- **doctors_with_users** - Doctors joined with user information
- **patients_with_owners** - Patients with owner contact details
- **medical_records_detailed** - Complete medical records with patient & doctor names

> 📊 **For complete database schema**, see [PROJECT_STRUCTURE.md - Database Schema](./PROJECT_STRUCTURE.md#-database-schema-supabase)

### Setup Instructions

1. Create a project at [Supabase](https://supabase.com)
2. Run the SQL migrations to create tables and views
3. Configure Row Level Security (RLS) policies
4. Update environment variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

---

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

**Important**: Default test accounts harus dibuat manual di Supabase atau melalui seeding script.

Untuk development, buat user dengan role:

- `admin` - Full system access
- `doctor` - Medical records & patient management
- `pet-owner` - View own pet records only

**Production**: Gunakan strong password dan enable 2FA untuk admin accounts.

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Resource Management

- `GET/POST/PATCH/DELETE /api/doctors` - Doctor CRUD operations
- `GET/POST/PATCH/DELETE /api/patients` - Patient CRUD operations
- `GET/POST/PATCH/DELETE /api/medical-records` - Medical records management
- `GET/POST/PATCH /api/corrections` - Correction requests workflow

### Admin & Utilities

- `GET/DELETE /api/audit-logs` - Audit logs management
- `GET /api/doctor-stats` - Doctor statistics
- `POST /api/register-pet` - Public pet registration

### Public Access (No Authentication)

- `GET /api/public/patients/[id]` - Get patient info by QR code

### Development/Testing

- `POST /api/password_verification` - Password verification utility
- `GET /api/test-db` - Database connection test
- `GET /api/test-password` - Password hashing test

> 📖 **For detailed API flow diagrams**, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

**Example Usage:**

```ts
// Fetch all doctors
const res = await fetch("/api/doctors");
const { doctors } = await res.json();

// Create new patient
const newPatient = await fetch("/api/patients", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(patientData),
});
```

---

## QR Code Scanner

The landing page includes a QR code scanner feature that allows pet owners to:

1. Upload or scan their pet's QR code
2. View pet information instantly (name, owner, visit history)
3. No account creation or login required

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Testing Scripts

- `npm test` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run test:security` - Run security tests only
- `npm run test:validation` - Run validation tests only
- `npm run test:ci` - Run tests in CI environment

### Code Style

This project uses:

- ESLint for code linting
- TypeScript for type safety
- Tailwind CSS for styling

## Security Best Practices

This project implements security best practices:

1. **Environment Variables**

   - NEVER commit `.env` files to Git
   - Use different keys for development and production
   - Rotate keys periodically

2. **Rate Limiting**

   - Implemented for all API endpoints
   - Production: Consider upgrading to Redis-based rate limiting for distributed systems

3. **Input Validation**

   - All user inputs are validated and sanitized
   - SQL injection protection via Supabase parameterized queries
   - XSS protection via input sanitization

4. **Authentication**

   - Password hashing with bcrypt (10 salt rounds)
   - Session management with HttpOnly cookies
   - JWT token validation on every API request

5. **Audit Logging**

   - All actions logged to `audit_logs` table
   - Includes: timestamp, user, action, resource, status, IP address

6. **HTTPS Only**
   - Production deployment MUST use HTTPS
   - Configure in Vercel/deployment platform

## Project Status

### ✅ Completed Features

- Backend service layer with Supabase integration
- Complete API routes for all resources
- Authentication & session management (bcrypt + HttpOnly cookies)
- Role-based access control (RBAC)
- Rate limiting & input validation
- Audit logging system
- QR code generation & scanning
- Medical record correction workflow
- Security testing suite

### 🚧 In Progress

- Frontend component integration with API endpoints
- Blockchain integration for medical record integrity (planned)

### 📋 Next Steps

1. **Frontend Integration**: Connect remaining UI components to API endpoints

   - `DoctorManagement.tsx` → `/api/doctors`
   - `Patients.tsx`, `AddPatient.tsx` → `/api/patients`
   - `MedicalRecords.tsx`, `PatientHistory.tsx` → `/api/medical-records`

2. **Real-time Features**: Implement Supabase Realtime for live updates

   - Notification system for correction approvals
   - Live dashboard updates

3. **Advanced Features**:

   - Blockchain hashing for medical record tamper-proofing
   - PDF report generation for medical records
   - Email notifications

4. **Production Deployment**:
   - Deploy to Vercel
   - Configure production environment variables
   - Setup Redis for distributed rate limiting
   - Enable monitoring & logging

> 📖 **For detailed architecture and technical documentation**, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## Contributing (Team Workflow)

Branching:

- `main` → stable
- `dev` → integration
- Feature: `feat/<feature-name>`
- Fix: `fix/<short-desc>`

Workflow:

1. Create branch from `dev`: `git checkout -b feat/<name>`
2. Commit small, meaningful changes
3. Run lint and (if applicable) `npx prisma migrate dev` when schema changes
4. Open PR to `dev` and request review
5. After approval, squash & merge

### Security Checklist Before PR

- [ ] No sensitive data (API keys, passwords) in code
- [ ] Input validation for all user inputs
- [ ] Error messages don't leak sensitive info
- [ ] Rate limiting applied to new endpoints
- [ ] Audit logging added for important actions
- [ ] Tests written for security-critical code

## License

This project is created for educational purposes.

## Contact

For questions or support, open an issue or contact the maintainers.

---

Built with ❤️ using Next.js and Tailwind CSS

---

## 📚 Documentation

- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Complete technical documentation

  - Detailed folder structure
  - Database schema with all fields
  - Request flow diagrams
  - Security implementation details
  - Architecture patterns

- **[src/server/README.md](./src/server/README.md)** - Backend service layer documentation

---

**Project**: VetClinic Management System  
**Version**: 0.1.0  
**Framework**: Next.js 14 + TypeScript + Supabase  
**Last Updated**: December 4, 2025  
**Repository**: [vet-clinic-devsecops](https://github.com/Dzyra46/vet-clinic-devsecops)

---

# vet-clinic

```

```
