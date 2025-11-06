import { NextRequest, NextResponse } from 'next/server';
import * as queries from '@/lib/property-lead-insights/queries';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateRange = searchParams.get('dateRange') || '30days';
    const agency = searchParams.get('agency') || undefined;
    const agent = searchParams.get('agent') || undefined;

    const filters = {
      dateRange,
      agency: agency !== 'all' ? agency : undefined,
      agent: agent !== 'all' ? agent : undefined,
    };

    console.log('Fetching dashboard data with filters:', filters);

    // Fetch all data in parallel
    const [
      overview,
      topProperties,
      topSuburbs,
      priceDistribution,
      sourceBreakdown,
      topAgents,
    ] = await Promise.all([
      queries.getOverviewMetrics(filters),
      queries.getTopProperties(filters),
      queries.getTopSuburbs(filters),
      queries.getPriceDistribution(filters),
      queries.getSourceBreakdown(filters),
      queries.getTopAgents(filters),
    ]);

    console.log('Successfully fetched dashboard data');

    return NextResponse.json({
      overview,
      topProperties,
      topSuburbs,
      priceDistribution,
      sourceBreakdown,
      topAgents,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
