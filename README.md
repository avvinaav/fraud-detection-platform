# AI-Generated Fraud Detection Platform

A production-ready Next.js application for detecting AI-generated and fraudulent content using multi-model voting analysis.

## 🚀 Features

- **Multi-Model Analysis**: Aggregates scores from 3+ AI detection models with specialized weighting
- **Real-Time Processing**: Asynchronous file upload and analysis with live progress tracking
- **Interactive Dashboards**: Visual heatmaps and analytics for fraud detection patterns
- **Detailed Investigation**: Content highlighting with confidence scores and model breakdowns
- **API-First Design**: RESTful endpoints for programmatic access
- **Dark Mode UI**: Modern Zinc-themed interface with Shadcn/UI components

## 🏗️ Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - High-quality React components (Radix UI)
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Data visualization
- **TanStack Query** - Server state management

### Backend
- **Next.js API Routes** - RESTful endpoints
- **FastAPI** (Planned) - Python backend for ML processing
- **PostgreSQL + Prisma** (Planned) - Database and ORM

## 📁 Project Structure

```
fraud-detection-platform/
├── app/
│   ├── api/v1/detect/          # Detection API endpoint
│   ├── dashboard/              # Main dashboard page
│   ├── analyze/                # File upload and analysis
│   ├── investigate/[id]/       # Detailed investigation view
│   ├── settings/               # Configuration and API keys
│   ├── layout.tsx              # Root layout
│   ├── providers.tsx           # React Query provider
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # Shadcn/UI base components
│   ├── dashboard/              # Dashboard-specific components
│   ├── analyze/                # Analysis components
│   ├── investigate/            # Investigation components
│   └── layout/                 # Navigation and layout
├── types/
│   └── analysis.ts             # TypeScript type definitions
└── lib/
    └── utils.ts                # Utility functions
```

## 🎯 Key Components

### Dashboard (`/dashboard`)
- **RiskHeatMap**: Grid visualization of fraud detection frequency by time
- **RecentAlertsList**: Table of latest detection results with status indicators
- **Stats Cards**: Key metrics and performance indicators

### Analysis (`/analyze`)
- **FileUploadZone**: Drag-and-drop file upload with validation
- **AnalysisProgressBar**: Real-time progress tracking with step indicators

### Investigation (`/investigate/[id]`)
- **ContentPreviewer**: Highlighted text with suspicious segments marked
- **ModelBreakdownChart**: Radar/Bar chart showing multi-model voting results

### Settings (`/settings`)
- API key management with visibility controls
- Webhook configuration for real-time notifications
- Model weight and threshold configuration

## 🔧 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📡 API Endpoints

### POST `/api/v1/detect`
Submit a document for fraud analysis.

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/detect \
  -F "file=@document.txt"
```

**Response:**
```json
{
  "jobId": "job_1234567890_abc123",
  "status": "pending",
  "message": "File received and queued for analysis",
  "timestamp": "2024-02-16T10:30:00.000Z"
}
```

### GET `/api/v1/detect?jobId=xxx`
Poll analysis status and retrieve results.

**Response:**
```json
{
  "jobId": "job_1234567890_abc123",
  "status": "completed",
  "progress": 100,
  "result": {
    "id": "analysis_xxx",
    "compositeScore": 0.85,
    "modelVotes": [...],
    "metadata": {...}
  }
}
```

## 🎨 Type Definitions

### Core Types

```typescript
interface AnalysisResult {
  id: string;
  sourceText: string;
  compositeScore: number;        // 0.0 to 1.0
  modelVotes: ModelVote[];
  timestamp: Date;
  metadata: AnalysisMetadata;
}

interface ModelVote {
  modelName: string;
  score: number;                 // 0.0 to 1.0
  weight: number;                // Specialized models: 1.5x
}
```

## 🎯 Multi-Model Voting Logic

The platform implements a weighted voting system:

1. **Three Detection Models**:
   - OpenAI GPT-4 Classifier (weight: 1.0)
   - Anthropic Claude Detector (weight: 1.0)
   - Specialized Fraud Detector (weight: 1.5x)

2. **Composite Score Calculation**:
   ```
   compositeScore = Σ(score × weight) / Σ(weight)
   ```

3. **Risk Classification**:
   - Safe: 0-20%
   - Low: 20-40%
   - Medium: 40-60%
   - High: 60-80%
   - Critical: 80-100%

## 🎨 Design System

### Color Palette (Zinc Theme)
- **Primary**: Emerald-500 (Safe/Success)
- **Destructive**: Red-500 (High Risk/Critical)
- **Warning**: Yellow-500 (Medium Risk)
- **Background**: Zinc-950
- **Card**: Zinc-900

### Typography
- **Font**: Inter
- **Monospace**: System font-mono

## 🔐 Security Considerations

- API key management with prefix visibility
- File type and size validation
- Secure webhook delivery
- Rate limiting (planned)
- Authentication (planned)

## 🚦 Roadmap

- [ ] FastAPI backend integration
- [ ] PostgreSQL database with Prisma
- [ ] Real-time analysis with WebSockets
- [ ] User authentication and multi-tenancy
- [ ] Export to PDF/CSV
- [ ] Advanced filtering and search
- [ ] Bulk analysis capabilities
- [ ] Custom model training interface

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please read CONTRIBUTING.md for guidelines.

## 📧 Support

For issues and questions, please open a GitHub issue or contact support@frauddetect.ai
