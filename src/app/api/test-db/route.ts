import { NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/property-lead-insights/db';

export async function GET() {
  try {
    console.log('Testing database connection...');
    const conn = await getDbConnection();
    console.log('Connection established');
    
    // Test simple query
    const [rows] = await conn.query('SELECT COUNT(*) as count FROM gold.lead_property_interest');
    console.log('Query result:', rows);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      rowCount: rows[0].count,
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
