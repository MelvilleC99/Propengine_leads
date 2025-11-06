import { NextRequest, NextResponse } from 'next/server';
import * as queries from '@/lib/property-lead-insights/queries';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const propertyId = searchParams.get('propertyId');
    const dateRange = searchParams.get('dateRange') || '30days';
    const agency = searchParams.get('agency') || undefined;
    const agent = searchParams.get('agent') || undefined;

    if (!propertyId) {
      return NextResponse.json(
        { error: 'propertyId is required' },
        { status: 400 }
      );
    }

    const filters = {
      dateRange,
      agency: agency !== 'all' ? agency : undefined,
      agent: agent !== 'all' ? agent : undefined,
    };

    const details = await queries.getPropertyDetails(Number(propertyId), filters);

    return NextResponse.json(details);
  } catch (error) {
    console.error('Error fetching property details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property details' },
      { status: 500 }
    );
  }
}
