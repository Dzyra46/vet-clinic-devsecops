import { NextResponse } from 'next/server';
import { CorrectionService } from '@/server/services/correctionService';

// GET /api/corrections - Get all correction requests or filter
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'pending' | 'approved' | 'rejected' | null;
    const doctor = searchParams.get('doctor');
    const search = searchParams.get('search');

    let corrections;

    if (search) {
      corrections = await CorrectionService.search(search);
    } else if (status) {
      corrections = await CorrectionService.getByStatus(status);
    } else if (doctor) {
      corrections = await CorrectionService.getByDoctor(doctor);
    } else {
      corrections = await CorrectionService.getAll();
    }

    return NextResponse.json({ corrections });
  } catch (error) {
    console.error('GET /api/corrections error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch corrections' },
      { status: 500 }
    );
  }
}

// POST /api/corrections - Create new correction request
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const correction = await CorrectionService.create(body);
    
    return NextResponse.json({ correction }, { status: 201 });
  } catch (error) {
    console.error('POST /api/corrections error:', error);
    return NextResponse.json(
      { error: 'Failed to create correction request' },
      { status: 500 }
    );
  }
}

// PATCH /api/corrections - Approve or reject correction
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, action, decidedBy } = body;

    if (!id || !action || !decidedBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let correction;

    if (action === 'approve') {
      correction = await CorrectionService.approve(id, decidedBy);
    } else if (action === 'reject') {
      correction = await CorrectionService.reject(id, decidedBy);
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "approve" or "reject"' },
        { status: 400 }
      );
    }

    if (!correction) {
      return NextResponse.json(
        { error: 'Correction request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ correction });
  } catch (error) {
    console.error('PATCH /api/corrections error:', error);
    return NextResponse.json(
      { error: 'Failed to update correction request' },
      { status: 500 }
    );
  }
}
