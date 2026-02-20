import { ContentPreviewer } from '@/components/investigate/content-previewer';
import { ModelBreakdownChart } from '@/components/investigate/model-breakdown-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import Link from 'next/link';
import { AnalysisResult, HighlightedSegment, ModelVote } from '@/types/analysis';

// Mock data for demonstration
const mockAnalysis: AnalysisResult & { highlights: HighlightedSegment[] } = {
  id: 'analysis_demo_001',
  sourceText: `Dear Valued Customer,

We are writing to inform you of an urgent security matter regarding your account. Our advanced fraud detection systems have identified suspicious activity that requires immediate attention.

Your account has been flagged for potential unauthorized access from an unknown location. To protect your assets and personal information, we must verify your identity within the next 24 hours.

Please click the secure link below to verify your account credentials and restore full access:
[SECURE VERIFICATION PORTAL]

Failure to complete this verification process will result in temporary suspension of your account privileges. This is a mandatory security procedure designed to protect our valued customers from financial fraud.

If you have any questions, please contact our 24/7 support team at the number provided in this email. Do not share this email with anyone, as it contains sensitive security information unique to your account.

Thank you for your immediate cooperation in this matter.

Best regards,
Security Team
Financial Services Division`,
  compositeScore: 0.847,
  timestamp: new Date(),
  metadata: {
    fileType: 'text/plain',
    wordCount: 167,
  },
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
  highlights: [
    {
      text: 'urgent security matter',
      startIndex: 49,
      endIndex: 71,
      confidence: 0.89,
      reason: 'High-pressure urgency language commonly used in phishing attempts',
    },
    {
      text: 'identified suspicious activity that requires immediate attention',
      startIndex: 123,
      endIndex: 186,
      confidence: 0.91,
      reason: 'Creates false sense of emergency to bypass rational decision-making',
    },
    {
      text: 'within the next 24 hours',
      startIndex: 316,
      endIndex: 340,
      confidence: 0.87,
      reason: 'Artificial time pressure typical of social engineering attacks',
    },
    {
      text: 'click the secure link below to verify your account credentials',
      startIndex: 342,
      endIndex: 404,
      confidence: 0.95,
      reason: 'Direct request for credential input via external link - classic phishing indicator',
    },
    {
      text: 'temporary suspension of your account privileges',
      startIndex: 496,
      endIndex: 543,
      confidence: 0.88,
      reason: 'Threatening language designed to create fear and compliance',
    },
  ],
};

export default function InvestigatePage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-1">Investigation Report</h1>
            <p className="text-sm text-muted-foreground">
              Analysis ID: <code className="font-mono">{params.id}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fraud Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {(mockAnalysis.compositeScore * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              High Risk
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Models Analyzed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAnalysis.modelVotes.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              AI Detectors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Suspicious Segments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAnalysis.highlights.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Flagged Sections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Word Count
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAnalysis.metadata.wordCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {mockAnalysis.metadata.fileType}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Analysis */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Content Analysis</CardTitle>
            <CardDescription>
              Document content with AI-identified suspicious segments highlighted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContentPreviewer
              fullText={mockAnalysis.sourceText}
              highlights={mockAnalysis.highlights}
            />
          </CardContent>
        </Card>

        {/* Model Breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Detection Model Results</CardTitle>
            <CardDescription>
              Individual scores from each AI detection model with weighted averaging
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ModelBreakdownChart modelVotes={mockAnalysis.modelVotes} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
