import { NextResponse } from 'next/server';
import { DoctorService } from '@/server/services/doctorService';

// GET /api/doctors - Get all doctors or search
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status') as 'active' | 'inactive' | null;

    let doctors;

    if (search) {
      doctors = await DoctorService.search(search);
    } else if (status) {
      doctors = await DoctorService.filterByStatus(status);
    } else {
      doctors = await DoctorService.getAll();
    }

    return NextResponse.json({ doctors });
  } catch (error) {
    console.error('GET /api/doctors error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}

// POST /api/doctors - Create new doctor
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const doctor = await DoctorService.create(body);
    
    return NextResponse.json({ doctor }, { status: 201 });
  } catch (error) {
    console.error('POST /api/doctors error:', error);
    return NextResponse.json(
      { error: 'Failed to create doctor' },
      { status: 500 }
    );
  }
}

// PATCH /api/doctors - Update doctor
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    const doctor = await DoctorService.update(id, data);
    
    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ doctor });
  } catch (error) {
    console.error('PATCH /api/doctors error:', error);
    return NextResponse.json(
      { error: 'Failed to update doctor' },
      { status: 500 }
    );
  }
}

// DELETE /api/doctors - Delete doctor
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Doctor ID required' },
        { status: 400 }
      );
    }

    const success = await DoctorService.delete(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/doctors error:', error);
    return NextResponse.json(
      { error: 'Failed to delete doctor' },
      { status: 500 }
    );
  }
}
