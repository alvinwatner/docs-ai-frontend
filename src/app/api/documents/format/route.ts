import { auth0 } from "@/lib/auth0";
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
      `${process.env.API_BASE_URL}/documents/format`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    // Return the blob response for formatted document
    const blob = await response.blob();

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': response.headers.get('Content-Disposition') || 'attachment; filename="formatted_document.docx"',
        'X-Document-ID': response.headers.get('X-Document-ID') || '',
        'X-Source-Document-ID': response.headers.get('X-Source-Document-ID') || '',
        'X-Processing-Time': response.headers.get('X-Processing-Time') || '0',
        'X-Paragraphs-Formatted': response.headers.get('X-Paragraphs-Formatted') || '0',
        'X-Empty-Paragraphs-Added': response.headers.get('X-Empty-Paragraphs-Added') || '0',
      },
    });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to format document' },
      { status: 500 }
    );
  }
}