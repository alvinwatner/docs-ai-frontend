import { auth0 } from '@/lib/auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get Auth0 token server-side
    const session = await auth0.getSession();
    const accessToken = session?.tokenSet.accessToken;

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the form data from the request
    const formData = await request.formData();

    // Forward to backend API
    const response = await fetch(
      `${process.env.API_BASE_URL}/documents/format-advanced-background`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Backend API error: ${response.status} - ${errorData.detail || 'Unknown error'}`
      );
    }

    // Parse JSON response which should contain session_id
    const data = await response.json();

    return NextResponse.json(data, { status: 202 });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to start document formatting',
      },
      { status: 500 }
    );
  }
}
