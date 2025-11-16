import { auth0 } from '@/lib/auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ document_id: string }> }
) {
  try {
    // Get Auth0 token server-side
    const session = await auth0.getSession();
    const accessToken = session?.tokenSet.accessToken;

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { document_id } = await params;

    // Forward to backend API
    const response = await fetch(
      `${process.env.API_BASE_URL}/documents/${document_id}/download`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(
        `Backend API error: ${response.status} - ${errorData.detail || 'Unknown error'}`
      );
    }

    // Return the blob response for formatted document
    const blob = await response.blob();

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': response.headers.get('Content-Disposition') || 'attachment; filename="formatted_document.docx"',
        'X-Document-ID': response.headers.get('X-Document-ID') || '',
      },
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to download document',
      },
      { status: 500 }
    );
  }
}
