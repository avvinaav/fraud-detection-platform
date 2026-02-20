# System Architecture

## 🏛️ Overview

The AI-Generated Fraud Detection Platform is a full-stack application designed for high-throughput content analysis using multi-model AI voting. The architecture prioritizes modularity, type safety, and scalability.

## 📐 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Dashboard   │  │   Analyze    │  │  Investigate  │     │
│  │  Components  │  │  Components  │  │  Components   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                   ┌────────▼────────┐                       │
│                   │  React Query    │                       │
│                   │  State Manager  │                       │
│                   └────────┬────────┘                       │
└────────────────────────────┼──────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────┐
│                      API Layer (Next.js)                   │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  /api/v1/detect                                       │ │
│  │  - POST: Submit file for analysis                     │ │
│  │  - GET: Poll job status                               │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────┬──────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────┐
│                    Processing Layer (Future)               │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  FastAPI Backend                                      │ │
│  │  - File processing                                    │ │
│  │  - ML model orchestration                             │ │
│  │  - Celery task queue                                  │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────┬──────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────┐
│                      ML Detection Models                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   OpenAI     │  │  Anthropic   │  │ Specialized  │   │
│  │  Classifier  │  │   Detector   │  │   Detector   │   │
│  │  Weight: 1.0 │  │  Weight: 1.0 │  │  Weight: 1.5 │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└───────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### Analysis Request Flow

```
1. User uploads file
   ↓
2. FileUploadZone validates file (type, size)
   ↓
3. POST /api/v1/detect with multipart form data
   ↓
4. API generates job ID, queues analysis
   ↓
5. AnalysisProgressBar polls GET /api/v1/detect?jobId=xxx
   ↓
6. FastAPI processes file:
   - Extract text content
   - Split into segments
   - Run through 3 detection models
   - Apply weighted scoring
   ↓
7. Results stored with analysis ID
   ↓
8. Frontend redirects to /investigate/[id]
   ↓
9. Display detailed results with highlights
```

## 🗂️ Component Architecture

### Frontend Components (Next.js + React)

```
app/
├── layout.tsx                  # Root layout with providers
├── providers.tsx               # TanStack Query setup
│
├── dashboard/
│   └── page.tsx               # Dashboard orchestrator
│
├── analyze/
│   └── page.tsx               # Analysis workflow orchestrator
│
├── investigate/[id]/
│   └── page.tsx               # Investigation orchestrator
│
└── settings/
    └── page.tsx               # Settings orchestrator

components/
├── ui/                        # Atomic Shadcn/UI components
│   ├── button.tsx
│   ├── card.tsx
│   └── progress.tsx
│
├── dashboard/                 # Dashboard-specific
│   ├── risk-heatmap.tsx      # Grid visualization
│   └── recent-alerts-list.tsx # Table component
│
├── analyze/                   # Analysis-specific
│   ├── file-upload-zone.tsx  # Drag-and-drop upload
│   └── analysis-progress-bar.tsx # Progress tracking
│
├── investigate/               # Investigation-specific
│   ├── content-previewer.tsx # Highlighted text display
│   └── model-breakdown-chart.tsx # Voting visualization
│
└── layout/
    └── navigation.tsx         # Global navigation
```

### Type System

```typescript
// Core domain types
types/analysis.ts
├── AnalysisResult           # Complete analysis result
├── ModelVote                # Individual model score
├── HighlightedSegment       # Text highlight data
├── Alert                    # Dashboard alert item
├── ApiKeyConfig             # API key metadata
└── WebhookConfig            # Webhook configuration

// Utility types
lib/utils.ts
├── RiskLevel                # Risk classification
├── getRiskLevel()           # Score → level mapping
├── getRiskColor()           # Level → color class
└── calculateCompositeScore() # Weighted average
```

## 🎯 Multi-Model Voting Logic

### Weighted Voting Algorithm

```typescript
interface ModelVote {
  modelName: string;
  score: number;      // 0.0 to 1.0
  weight: number;     // Specialized models: 1.5x
}

function calculateCompositeScore(votes: ModelVote[]): number {
  const totalWeight = votes.reduce((sum, v) => sum + v.weight, 0);
  const weightedSum = votes.reduce((sum, v) => sum + (v.score * v.weight), 0);
  return weightedSum / totalWeight;
}

// Example:
// OpenAI: 0.78 × 1.0 = 0.78
// Anthropic: 0.82 × 1.0 = 0.82
// Specialized: 0.93 × 1.5 = 1.395
// Total Weight: 3.5
// Composite: (0.78 + 0.82 + 1.395) / 3.5 = 0.855
```

### Risk Classification

```typescript
function getRiskLevel(score: number): RiskLevel {
  if (score < 0.2) return { level: 'safe', score };
  if (score < 0.4) return { level: 'low', score };
  if (score < 0.6) return { level: 'medium', score };
  if (score < 0.8) return { level: 'high', score };
  return { level: 'critical', score };
}
```

## 🎨 Design System

### Color Semantics

```typescript
const riskColors = {
  safe: 'emerald-500',      // 0-20%
  low: 'green-500',         // 20-40%
  medium: 'yellow-500',     // 40-60%
  high: 'orange-500',       // 60-80%
  critical: 'red-500',      // 80-100%
};
```

### Component States

```typescript
type AnalysisStatus = 
  | 'idle'           // No file selected
  | 'uploading'      // File upload in progress
  | 'processing'     // Text extraction
  | 'analyzing'      // ML models running
  | 'completed'      // Analysis finished
  | 'error';         // Error occurred
```

## 🔌 API Design

### RESTful Endpoints

```typescript
// Submit analysis job
POST /api/v1/detect
Content-Type: multipart/form-data

Request:
{
  file: File
}

Response: 202 Accepted
{
  jobId: string
  status: 'pending'
  message: string
  timestamp: string
}

// Poll job status
GET /api/v1/detect?jobId=xxx

Response: 200 OK
{
  jobId: string
  status: 'completed' | 'processing' | 'failed'
  progress: number      // 0-100
  result?: AnalysisResult
  error?: string
}
```

### Error Handling

```typescript
// Client-side error handling
try {
  const response = await fetch('/api/v1/detect', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  const data = await response.json();
  return data;
} catch (error) {
  // Display error to user
  console.error('Analysis failed:', error);
}
```

## 🚀 Performance Optimizations

### 1. Asynchronous Processing

```typescript
// Don't block UI during analysis
async function analyzeDocument(file: File) {
  // Submit job (fast)
  const { jobId } = await submitAnalysis(file);
  
  // Poll status (non-blocking)
  return pollJobStatus(jobId);
}
```

### 2. Progressive Rendering

```typescript
// Render results as they arrive
<AnimatePresence mode="wait">
  {status === 'idle' && <UploadZone />}
  {status === 'processing' && <ProgressBar />}
  {status === 'completed' && <Results />}
</AnimatePresence>
```

### 3. Data Caching

```typescript
// TanStack Query caching
const { data } = useQuery({
  queryKey: ['analysis', id],
  queryFn: () => fetchAnalysis(id),
  staleTime: 60 * 1000,  // 1 minute
});
```

## 🔐 Security Architecture

### Input Validation

```typescript
// File validation
const ALLOWED_TYPES = ['.txt', '.pdf', '.docx'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function validateFile(file: File): boolean {
  const extension = '.' + file.name.split('.').pop();
  return ALLOWED_TYPES.includes(extension) && file.size <= MAX_SIZE;
}
```

### API Key Management

```typescript
interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;  // Only show prefix
  createdAt: Date;
  lastUsed?: Date;
}

// Never expose full key in frontend
// Store full key securely in backend
```

## 📊 State Management

### Server State (TanStack Query)

```typescript
// Automatic caching, refetching, and updates
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Client State (React Hooks)

```typescript
// Local component state
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [isAnalyzing, setIsAnalyzing] = useState(false);
const [progress, setProgress] = useState(0);
```

## 🧪 Testing Strategy

### Unit Tests (Future)

```typescript
// Component tests
describe('FileUploadZone', () => {
  it('validates file type', () => {
    expect(validateFile(txtFile)).toBe(true);
    expect(validateFile(exeFile)).toBe(false);
  });
});

// Utility tests
describe('getRiskLevel', () => {
  it('classifies risk correctly', () => {
    expect(getRiskLevel(0.1).level).toBe('safe');
    expect(getRiskLevel(0.9).level).toBe('critical');
  });
});
```

### Integration Tests (Future)

```typescript
// API endpoint tests
describe('POST /api/v1/detect', () => {
  it('accepts valid file upload', async () => {
    const response = await request(app)
      .post('/api/v1/detect')
      .attach('file', 'test.txt')
      .expect(202);
    
    expect(response.body).toHaveProperty('jobId');
  });
});
```

## 📈 Scalability Considerations

### Horizontal Scaling

- **Frontend**: Deploy multiple Next.js instances behind load balancer
- **API**: Stateless design allows easy horizontal scaling
- **ML Processing**: Queue-based architecture (Celery) for distributed processing

### Database Optimization (Future)

```sql
-- Indexed queries for fast lookups
CREATE INDEX idx_analysis_timestamp ON analyses(timestamp DESC);
CREATE INDEX idx_analysis_score ON analyses(composite_score DESC);
CREATE INDEX idx_alerts_status ON alerts(status, timestamp DESC);
```

### Caching Strategy

```typescript
// Redis caching for frequent queries
const cachedResult = await redis.get(`analysis:${id}`);
if (cachedResult) return JSON.parse(cachedResult);

const result = await database.getAnalysis(id);
await redis.setex(`analysis:${id}`, 3600, JSON.stringify(result));
return result;
```

## 🔄 Future Enhancements

1. **Real-time Updates**: WebSocket connections for live progress
2. **Batch Processing**: Analyze multiple files concurrently
3. **Custom Models**: User-uploaded detection models
4. **Advanced Analytics**: Historical trends and pattern detection
5. **Export Capabilities**: PDF reports, CSV exports
6. **Multi-tenancy**: Organization-based access control
7. **Audit Logging**: Complete activity tracking
8. **API Rate Limiting**: Protect against abuse

## 📚 References

- [Next.js App Router](https://nextjs.org/docs/app)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [FastAPI](https://fastapi.tiangolo.com/)
