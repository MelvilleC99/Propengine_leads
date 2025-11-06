import { NextResponse } from 'next/server';
import * as queries from '@/lib/property-lead-insights/queries';

export async function GET() {
  try {
    const options = await queries.getFilterOptions();
    return NextResponse.json(options);
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter options' },
      { status: 500 }
    );
  }
}
