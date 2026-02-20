# Setup & Deployment Guide

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages:
- Next.js 14+ for the application framework
- TypeScript for type safety
- Tailwind CSS for styling
- Shadcn/UI components
- Framer Motion for animations
- Recharts for data visualization
- TanStack Query for state management

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The application will automatically redirect to `/dashboard`.

### 3. Navigate the Platform

- **Dashboard** (`/dashboard`): View fraud detection analytics and recent alerts
- **Analyze** (`/analyze`): Upload files for fraud detection analysis
- **Investigate** (`/investigate/demo`): View detailed analysis results
- **Settings** (`/settings`): Manage API keys and webhooks

## 🏗️ Production Build

### Build the Application

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

### Start Production Server

```bash
npm start
```

The production server will run on port 3000.

## 🔌 API Integration

### Using the Detection API

The platform provides a RESTful API for programmatic access:

#### Submit File for Analysis

```bash
curl -X POST http://localhost:3000/api/v1/detect \
  -F "file=@suspicious-email.txt" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Check Analysis Status

```bash
curl http://localhost:3000/api/v1/detect?jobId=job_abc123 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 🎨 Customization

### Color Theme

Modify the color palette in `app/globals.css`:

```css
:root {
  --primary: 142.1 76.2% 36.3%;     /* Emerald-500 for safe */
  --destructive: 0 62.8% 30.6%;     /* Red-500 for high risk */
}
```

### Model Weights

Adjust detection model weights in the Settings page or directly in the analysis logic:

```typescript
const modelVotes = [
  { modelName: 'OpenAI', score: 0.78, weight: 1.0 },
  { modelName: 'Anthropic', score: 0.82, weight: 1.0 },
  { modelName: 'Specialized', score: 0.93, weight: 1.5 }, // 1.5x weight
];
```

## 🔧 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
FASTAPI_URL=http://localhost:8000

# Future integrations
# DATABASE_URL="postgresql://..."
# NEXTAUTH_SECRET="..."
```

## 📦 Component Library

The platform uses Shadcn/UI components. To add more components:

```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add table
```

## 🐳 Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Build and Run

```bash
docker build -t fraud-detection-platform .
docker run -p 3000:3000 fraud-detection-platform
```

## 🚀 Deployment Options

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Configure environment variables
4. Deploy

```bash
npx vercel
```

### Other Platforms

- **Netlify**: Add `netlify.toml` configuration
- **AWS Amplify**: Connect GitHub repository
- **Railway**: One-click deployment
- **DigitalOcean App Platform**: Use Docker or buildpack

## 🔐 Security Checklist

- [ ] Set secure `NEXTAUTH_SECRET`
- [ ] Enable HTTPS in production
- [ ] Configure CORS policies
- [ ] Implement rate limiting
- [ ] Add API key validation
- [ ] Set up monitoring and logging

## 📊 Performance Optimization

### Enable Static Optimization

```typescript
// next.config.js
module.exports = {
  output: 'standalone',
  images: {
    domains: ['your-cdn-domain.com'],
  },
};
```

### Configure Caching

```typescript
// app/api/v1/detect/route.ts
export const dynamic = 'force-dynamic';
export const revalidate = 0;
```

## 🧪 Testing

### Run Type Checks

```bash
npm run build
```

### Lint Code

```bash
npm run lint
```

## 📝 Next Steps

1. **Backend Integration**: Connect FastAPI for ML processing
2. **Database Setup**: Configure PostgreSQL with Prisma
3. **Authentication**: Implement NextAuth.js
4. **Real-time Updates**: Add WebSocket support
5. **Analytics**: Integrate monitoring (Posthog, Mixpanel)

## 🆘 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### Build Errors

```bash
# Check TypeScript errors
npm run build
# Fix type issues in reported files
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/UI](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion/)
- [TanStack Query](https://tanstack.com/query)

## 💬 Support

For issues or questions:
- GitHub Issues: [github.com/your-repo/issues](https://github.com)
- Email: support@frauddetect.ai
- Documentation: [docs.frauddetect.ai](https://docs.frauddetect.ai)
