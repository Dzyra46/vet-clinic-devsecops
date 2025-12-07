import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, rateLimitResponse, RATE_LIMITS } from '@/lib/ratelimit/ratelimiter';
import { sanitizeString } from '@/lib/validation/sanitizers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Rate limit: 100 requests per minute for public reads
    const rateLimitResult = checkRateLimit(
      request,
      RATE_LIMITS.API_READ.limit,
      RATE_LIMITS.API_READ.windowMs
    );

    if (!rateLimitResult.allowed) {
      const limitResponse = rateLimitResponse(
        rateLimitResult.resetTime,
        rateLimitResult.remaining
      );
      return NextResponse.json(
        { error: limitResponse.body.error },
        { 
          status: limitResponse.statusCode,
          headers: limitResponse.headers
        }
      );
    }

    // Sanitize patient ID
    const patientId = sanitizeString(params.id);

    if (!patientId) {
      return NextResponse.json(
        { error: 'Invalid patient ID' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch patient data from patients_with_owners view
    const { data: patient, error: patientError } = await supabase
      .from('patients_with_owners')
      .select('*')
      .eq('id', patientId)
      .single();

    if (patientError || !patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    // Fetch medical records from medical_records_detailed view
    const { data: records, error: recordsError } = await supabase
      .from('medical_records_detailed')
      .select('*')
      .eq('patient_id', patientId)
      .order('visit_date', { ascending: false });

    if (recordsError) {
      console.error('Error fetching medical records:', recordsError);
    }

    // Return patient and medical records
    return NextResponse.json({
      patient,
      medicalRecords: records || [],
    });

  } catch (error) {
    console.error('Error in public patient endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient data' },
      { status: 500 }
    );
  }
}