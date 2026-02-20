export interface ModelVote {
  modelName: string;
  score: number;
  weight: number;
}

export interface AnalysisMetadata {
  fileType: string;
  wordCount: number;
}

export interface AnalysisResult {
  id: string;
  sourceText: string;
  compositeScore: number; // 0.0 to 1.0
  modelVotes: ModelVote[];
  timestamp: Date;
  metadata: AnalysisMetadata;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface AnalysisJob {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: AnalysisResult;
  error?: string;
}

export interface RiskLevel {
  level: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  score: number;
}

export interface HighlightedSegment {
  text: string;
  startIndex: number;
  endIndex: number;
  confidence: number;
  reason: string;
}

export interface Alert {
  id: string;
  timestamp: Date;
  confidenceScore: number;
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  sourcePreview: string;
}

export interface ApiKeyConfig {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: Date;
  lastUsed?: Date;
}

export interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  enabled: boolean;
}
