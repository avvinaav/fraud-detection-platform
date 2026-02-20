'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Info } from 'lucide-react';
import { HighlightedSegment } from '@/types/analysis';
import { getRiskColor, getRiskLevel } from '@/lib/utils';

interface ContentPreviewerProps {
  fullText: string;
  highlights: HighlightedSegment[];
}

export function ContentPreviewer({ fullText, highlights }: ContentPreviewerProps) {
  // Sort highlights by start index
  const sortedHighlights = [...highlights].sort((a, b) => a.startIndex - b.startIndex);

  // Build segments of text with highlight information
  const segments: Array<{ text: string; highlight?: HighlightedSegment }> = [];
  let currentIndex = 0;

  sortedHighlights.forEach((highlight) => {
    // Add non-highlighted text before this highlight
    if (currentIndex < highlight.startIndex) {
      segments.push({
        text: fullText.slice(currentIndex, highlight.startIndex)
      });
    }

    // Add highlighted text
    segments.push({
      text: highlight.text,
      highlight
    });

    currentIndex = highlight.endIndex;
  });

  // Add remaining text after last highlight
  if (currentIndex < fullText.length) {
    segments.push({
      text: fullText.slice(currentIndex)
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Content Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Suspicious segments highlighted by AI models
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 text-yellow-500" />
          <span>{highlights.length} suspicious segments detected</span>
        </div>
      </div>

      {/* Content Display */}
      <div className="border rounded-lg p-6 bg-zinc-900/30 max-h-[600px] overflow-y-auto">
        <div className="prose prose-invert max-w-none">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {segments.map((segment, idx) => {
              if (segment.highlight) {
                const riskLevel = getRiskLevel(segment.highlight.confidence);
                return (
                  <motion.span
                    key={idx}
                    initial={{ backgroundColor: 'transparent' }}
                    animate={{ 
                      backgroundColor: riskLevel.level === 'critical' || riskLevel.level === 'high'
                        ? 'rgba(239, 68, 68, 0.15)'
                        : riskLevel.level === 'medium'
                        ? 'rgba(234, 179, 8, 0.15)'
                        : 'rgba(16, 185, 129, 0.15)'
                    }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className={`
                      relative inline border-b-2 cursor-help
                      ${riskLevel.level === 'critical' || riskLevel.level === 'high'
                        ? 'border-red-500'
                        : riskLevel.level === 'medium'
                        ? 'border-yellow-500'
                        : 'border-emerald-500'
                      }
                    `}
                    title={`${(segment.highlight.confidence * 100).toFixed(0)}% confidence - ${segment.highlight.reason}`}
                  >
                    {segment.text}
                    <span className={`
                      absolute -top-1 -right-1 w-2 h-2 rounded-full
                      ${riskLevel.level === 'critical' || riskLevel.level === 'high'
                        ? 'bg-red-500'
                        : riskLevel.level === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-emerald-500'
                      }
                    `} />
                  </motion.span>
                );
              }
              return <span key={idx}>{segment.text}</span>;
            })}
          </p>
        </div>
      </div>

      {/* Highlights Legend */}
      <div className="border rounded-lg p-4 bg-zinc-900/30 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Info className="w-4 h-4" />
          <span>Detected Issues</span>
        </div>
        
        <div className="space-y-2">
          {highlights.map((highlight, idx) => {
            const riskLevel = getRiskLevel(highlight.confidence);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700"
              >
                <div className={`
                  w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0
                  ${riskLevel.level === 'critical' || riskLevel.level === 'high'
                    ? 'bg-red-500'
                    : riskLevel.level === 'medium'
                    ? 'bg-yellow-500'
                    : 'bg-emerald-500'
                  }
                `} />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <code className="text-xs font-mono text-zinc-400">
                      Position {highlight.startIndex}-{highlight.endIndex}
                    </code>
                    <span className={`text-xs font-semibold ${getRiskColor(riskLevel.level)}`}>
                      {(highlight.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {highlight.reason}
                  </p>
                  <p className="text-xs text-zinc-500 italic line-clamp-2">
                    "{highlight.text}"
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
