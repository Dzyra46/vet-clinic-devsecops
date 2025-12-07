import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyPassword } from '@/lib/auth/password';
import { checkRateLimit, rateLimitResponse, RATE_LIMITS } from '@/lib/ratelimit/ratelimiter';

export async function POST(request: NextRequest) {
  try {
    // 1. Check rate limit (prevent brute force)
    const { allowed, remaining, resetTime } = checkRateLimit(
      request,
      5, // 5 attempts
      15 * 60 * 1000 // 15 minutes
    );

    if (!allowed) {
      const response = rateLimitResponse(resetTime, remaining);
      return NextResponse.json(response.body, {
        status: response.statusCode,
        headers: response.headers,
      });
    }

    // 2. Parse request body
    const body = await request.json();
    const { patientId, qrCode, password } = body;

    if (!patientId || !qrCode || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 3. Verify patient exists and QR code matches
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, qr_code, owner_id, name')
      .eq('id', patientId)
      .single();

    if (patientError || !patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    if (patient.qr_code !== qrCode) {
      return NextResponse.json(
        { error: 'Invalid QR code' },
        { status: 401 }
      );
    }

    if (patient.qr_code === 'PENDING') {
      return NextResponse.json(
        { error: 'QR code not yet generated. Please contact the clinic.' },
        { status: 403 }
      );
    }

    // 4. Verify owner password
    const { data: owner, error: ownerError } = await supabase
      .from('users')
      .select('id, password_hash, name')
      .eq('id', patient.owner_id)
      .single();

    if (ownerError || !owner) {
      return NextResponse.json(
        { error: 'Owner account not found' },
        { status: 404 }
      );
    }

    const isPasswordValid = await verifyPassword(password, owner.password_hash);

    if (!isPasswordValid) {
      // Log failed attempt
      await supabase.from('audit_logs').insert({
        user_id: owner.id,
        user_name: owner.name,
        user_role: 'pet-owner',
        action: 'access_denied',
        resource: 'medical_records',
        details: `Failed password verification for patient: ${patient.name}`,
        status: 'failed',
      });

      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      );
    }

    // 5. Log successful access
    await supabase.from('audit_logs').insert({
      user_id: owner.id,
      user_name: owner.name,
      user_role: 'pet-owner',
      action: 'access_granted',
      resource: 'medical_records',
      details: `Accessed medical records for patient: ${patient.name}`,
      status: 'success',
    });

    return NextResponse.json({
      success: true,
      message: 'Access granted',
    });

  } catch (error) {
    console.error('POST /api/verify-pet-access error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}