'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUploadZone } from '@/components/analyze/file-upload-zone';
import { AnalysisProgressBar } from '@/components/analyze/analysis-progress-bar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AnalyzePage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'analyzing' | 'completed' | 'error'>('idle');
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setStatus('idle');
    setProgress(0);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setStatus('idle');
    setProgress(0);
    setAnalysisId(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setStatus('uploading');
    setProgress(0);

    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 500));
    setProgress(25);
    setStatus('processing');

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProgress(40);

    setStatus('analyzing');
    
    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 99) {
          clearInterval(progressInterval);
          return 99;
        }
        return prev + 1;
      });
    }, 50);

    // Simulate completion
    await new Promise(resolve => setTimeout(resolve, 3000));
    clearInterval(progressInterval);
    
    setProgress(100);
    setStatus('completed');
    setAnalysisId('analysis_demo_001');
    setIsAnalyzing(false);
  };

  const handleViewResults = () => {
    if (analysisId) {
      router.push(`/investigate/${analysisId}`);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Analysis</h1>
        <p className="text-muted-foreground">
          Upload documents to detect AI-generated or fraudulent content
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analysis Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>
                Select a file to analyze for potential fraud indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploadZone
                onFileSelect={handleFileSelect}
                onClear={handleClear}
                selectedFile={selectedFile}
                isProcessing={isAnalyzing}
              />

              {selectedFile && status === 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full"
                    size="lg"
                  >
                    Start Analysis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Progress Display */}
          {status !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AnalysisProgressBar
                progress={progress}
                status={status}
              />
            </motion.div>
          )}

          {/* Results Actions */}
          <AnimatePresence>
            {status === 'completed' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-emerald-500/20 bg-emerald-500/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold mb-1">Analysis Complete</h3>
                        <p className="text-sm text-muted-foreground">
                          View detailed results and model breakdown
                        </p>
                      </div>
                      <Button onClick={handleViewResults}>
                        View Results
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-emerald-500">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Upload Document</p>
                    <p className="text-xs text-muted-foreground">
                      Submit text, PDF, or DOCX files
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-emerald-500">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Multi-Model Analysis</p>
                    <p className="text-xs text-muted-foreground">
                      3 AI models analyze content
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-emerald-500">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Weighted Scoring</p>
                    <p className="text-xs text-muted-foreground">
                      Specialized models weighted 1.5x
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-emerald-500">4</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Review Results</p>
                    <p className="text-xs text-muted-foreground">
                      Get detailed fraud indicators
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <CardTitle className="text-base">Important Notes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>Analysis takes 10-30 seconds per document</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>Specialized detectors are weighted higher</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>Results show confidence scores 0-100%</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
