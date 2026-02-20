'use client';

import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AnalysisProgressBarProps {
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'analyzing' | 'completed' | 'error';
  currentStep?: string;
  error?: string;
}

const steps = [
  { value: 0, label: 'Preparing upload...' },
  { value: 25, label: 'Uploading document...' },
  { value: 40, label: 'Extracting text content...' },
  { value: 60, label: 'Running AI detection models...' },
  { value: 80, label: 'Calculating composite scores...' },
  { value: 100, label: 'Analysis complete!' },
];

export function AnalysisProgressBar({ 
  progress, 
  status, 
  currentStep,
  error 
}: AnalysisProgressBarProps) {
  const getCurrentStepLabel = () => {
    if (currentStep) return currentStep;
    
    for (let i = steps.length - 1; i >= 0; i--) {
      if (progress >= steps[i].value) {
        return steps[i].label;
      }
    }
    return steps[0].label;
  };

  if (status === 'idle') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 p-6 border rounded-lg bg-zinc-900/50"
    >
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {status === 'error' ? (
            <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-full">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          ) : status === 'completed' ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full"
            >
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </motion.div>
          ) : (
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            </div>
          )}
          
          <div>
            <h3 className="font-semibold">
              {status === 'error' ? 'Analysis Failed' :
               status === 'completed' ? 'Analysis Complete' :
               'Analyzing Document'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {status === 'error' ? error : getCurrentStepLabel()}
            </p>
          </div>
        </div>

        <div className="text-2xl font-bold text-emerald-500">
          {progress}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress 
          value={progress} 
          className="h-2"
        />
        
        {/* Step Indicators */}
        {status !== 'error' && status !== 'completed' && (
          <div className="flex justify-between text-xs text-muted-foreground">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: progress >= step.value ? 1 : 0.3,
                  scale: progress >= step.value ? 1 : 0.9
                }}
                className={`
                  ${progress >= step.value ? 'text-emerald-500 font-medium' : ''}
                `}
              >
                {step.value}%
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Processing Details */}
      {status === 'analyzing' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-3 gap-4 pt-4 border-t"
        >
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Models Running</p>
            <p className="text-lg font-semibold">3/3</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Segments Analyzed</p>
            <p className="text-lg font-semibold">127</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Time Elapsed</p>
            <p className="text-lg font-semibold">12s</p>
          </div>
        </motion.div>
      )}

      {/* Completion Message */}
      {status === 'completed' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg"
        >
          <p className="text-sm text-emerald-500">
            Your document has been successfully analyzed. View the detailed results below.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
