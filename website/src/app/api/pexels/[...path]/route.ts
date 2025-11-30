import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PEXELS_API_BASE = 'https://api.pexels.com';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const apiKey = process.env.PEXELS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'PEXELS_API_KEY environment variable is not set' },
      { status: 500 }
    );
  }

  const { path } = await params;
  const pathStr = path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${PEXELS_API_BASE}/${pathStr}${searchParams ? `?${searchParams}` : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: apiKey,
      },
      next: {
        revalidate: 300, // Cache for 5 minutes
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Pexels API error: ${error}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Pexels API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from Pexels API' },
      { status: 500 }
    );
  }
}
