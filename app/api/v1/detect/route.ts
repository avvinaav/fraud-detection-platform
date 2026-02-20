import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/v1/detect
 * 
 * Accepts multipart file upload and returns a job ID for polling status
 * 
 * Expected request body:
 * - file: File (txt, pdf, docx)
 * 
 * Returns:
 * - jobId: string
 * - status: 'pending' | 'processing' | 'completed' | 'failed'
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only TXT, PDF, and DOCX files are supported.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Generate job ID
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // In production, this would:
    // 1. Upload file to storage
    // 2. Queue background job (Celery/FastAPI Background Tasks)
    // 3. Store job metadata in database
    
    // For demo, return immediate job ID
    const response = {
      jobId,
      status: 'pending' as const,
      message: 'File received and queued for analysis',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 202 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/detect?jobId=xxx
 * 
 * Poll job status and retrieve results when complete
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Query job status from database/cache
    // 2. Return current progress and status
    // 3. Return full results when completed

    // For demo, return mock completed analysis
    const response = {
      jobId,
      status: 'completed' as const,
      progress: 100,
      result: {
        id: `analysis_${jobId}`,
        sourceText: 'Sample analyzed text...',
        compositeScore: 0.85,
        modelVotes: [
          {
            modelName: 'OpenAI GPT-4 Classifier',
            score: 0.78,
            weight: 1.0,
          },
          {
            modelName: 'Anthropic Claude Detector',
            score: 0.82,
            weight: 1.0,
          },
          {
            modelName: 'Specialized Fraud Detector',
            score: 0.93,
            weight: 1.5,
          },
        ],
        timestamp: new Date().toISOString(),
        metadata: {
          fileType: 'text/plain',
          wordCount: 150,
        },
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
