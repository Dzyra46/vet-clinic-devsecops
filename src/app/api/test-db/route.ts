import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('ENV Check:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    });

    // Gunakan admin client untuk bypass RLS
    const supabase = createAdminClient();
    console.log('✅ Supabase admin client created');
    
    // Test query: count patients
    const { count, error } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });

    console.log('Query result:', { count, error });

    if (error) {
      console.error('❌ Database error:', error);
      return NextResponse.json(
        { success: false, error: error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      patientCount: count,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}