import { NextResponse } from 'next/server';
import { PatientService } from '@/server/services/patientService';

// GET /api/patients - Get all patients or search
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status') as 'healthy' | 'under-treatment' | 'recovered' | null;
    const owner = searchParams.get('owner');

    let patients;

    if (search) {
      patients = await PatientService.search(search);
    } else if (status) {
      patients = await PatientService.filterByStatus(status);
    } else if (owner) {
      patients = await PatientService.getByOwner(owner);
    } else {
      patients = await PatientService.getAll();
    }

    return NextResponse.json({ patients });
  } catch (error) {
    console.error('GET /api/patients error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}

// POST /api/patients - Create new patient
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const patient = await PatientService.create(body);
    
    return NextResponse.json({ patient }, { status: 201 });
  } catch (error) {
    console.error('POST /api/patients error:', error);
    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    );
  }
}

// PATCH /api/patients - Update patient
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    const patient = await PatientService.update(id, data);
    
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ patient });
  } catch (error) {
    console.error('PATCH /api/patients error:', error);
    return NextResponse.json(
      { error: 'Failed to update patient' },
      { status: 500 }
    );
  }
}

// DELETE /api/patients - Delete patient
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Patient ID required' },
        { status: 400 }
      );
    }

    const success = await PatientService.delete(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/patients error:', error);
    return NextResponse.json(
      { error: 'Failed to delete patient' },
      { status: 500 }
    );
  }
}
