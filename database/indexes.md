# Database Indexes

## Overview

This document lists all database indexes for the VetClinic system.
Indexes are critical for query performance and must be maintained.

## Index List

### Patients Table

- `idx_patients_qr_code` - QR code lookup (PUBLIC ACCESS - most critical)
- `idx_patients_owner_id` - Owner's pets list
- `idx_patients_status` - Filter by health status
- `idx_patients_owner_status` - Composite: owner + status

### Medical Records Table

- `idx_medical_records_patient_id` - Patient history
- `idx_medical_records_doctor_id` - Doctor's records
- `idx_medical_records_visit_date` - Chronological sorting
- `idx_medical_records_patient_date` - Composite: patient + date

### Audit Logs Table

- `idx_audit_logs_user_id` - User activity tracking
- `idx_audit_logs_timestamp` - Time-based filtering
- `idx_audit_logs_action` - Filter by action type
- `idx_audit_logs_resource` - Filter by resource
- `idx_audit_logs_user_timestamp` - Composite: user + time

### Corrections Table

- `idx_corrections_status` - Pending/approved/rejected filter
- `idx_corrections_doctor_id` - Doctor's corrections
- `idx_corrections_record_id` - Record corrections
- `idx_corrections_doctor_status` - Composite: doctor + status

### Sessions Table (AUTHENTICATION)

- `idx_sessions_token` - Session validation (CRITICAL)
- `idx_sessions_user_id` - User sessions
- `idx_sessions_expires_at` - Active sessions
- `idx_sessions_token_expires` - Composite: validation

### Doctors Table

- `idx_doctors_user_id` - Doctor-user relationship
- `idx_doctors_status` - Active/inactive filter

### Users Table

- `idx_users_email` - Login lookup
- `idx_users_role` - Role-based queries

## Maintenance

### When to Add New Indexes

- When query execution time > 100ms
- When monitoring shows slow queries
- When adding new query patterns

### When to Remove Indexes

- If index is never used (check pg_stat_user_indexes)
- If it causes more write overhead than read benefit

### Monitoring

Check index usage:

```sql
SELECT * FROM pg_stat_user_indexes
WHERE schemaname = 'public';
```
