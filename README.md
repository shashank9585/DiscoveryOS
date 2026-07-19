## ✨ DiscoveryOS - AI Product Intelligence Platform

A premium SaaS application that transforms scattered customer feedback into evidence-backed product decisions.

### 🚀 Quick Start

```bash
cd discovery-os
npm install
npm run dev
```

Then open **http://localhost:3000** in your browser.

### 📋 What's Included (MVP Complete)

#### ✅ **Core Pages**
- **Executive Dashboard** (/) - KPIs, Pain Points, Recent Uploads
- **Customer Insights** (/insights) - Pain point clusters, themes, sentiment analysis
- **Product Analytics** (/analytics) - Feature adoption, funnel analysis, conversion trends
- **Risk Dashboard** (/risk) - Churn risks, adoption drops, sentiment spikes
- **AI Reports** (/reports) - Auto-generated product discovery and roadmap recommendations
- **File Upload** (/upload) - Drag-drop interface for PDFs, TXT, CSV, DOCX
- **Projects** (/projects) - Project management
- **Settings** (/settings) - Configuration and preferences

#### ✅ **UI/UX Features**
- Dark mode & light mode toggle
- Responsive layout (desktop-first)
- Premium SaaS design with Tailwind CSS
- Sidebar navigation
- Top navigation bar with theme switcher
- Loading states & error handling
- KPI cards with trend indicators
- Charts (using Recharts)
- Data tables and lists

#### ✅ **File Processing**
- Support for: PDF, TXT, CSV, DOCX files
- File validation (50MB size limit)
- Text chunking for AI processing
- Drag-drop upload UI
- Upload progress tracking

#### ✅ **Sample Data**
- Mock dashboard data with realistic metrics
- Sample pain points, insights, and feedback
- Analytics data (conversion rates, bounce rates, churn)
- Risk indicators
- Generated reports

#### ✅ **Components**
- KPI Cards (with trends)
- Pain Points Card
- Upload Status Card
- Theme Provider (dark/light mode)
- Sidebar with navigation
- Top navigation bar
- Layout wrapper

### 🔧 Tech Stack

- **Frontend:** Next.js 16+ with TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Custom built + Lucide React icons
- **Charts:** Recharts
- **State Management:** React hooks
- **Package Manager:** npm

### 📦 Project Structure

```
discovery-os/
├── app/                         # Next.js App Router
│   ├── page.tsx                 # Executive Dashboard
│   ├── insights/page.tsx        # Customer Insights
│   ├── analytics/page.tsx       # Product Analytics
│   ├── risk/page.tsx           # Risk Dashboard
│   ├── reports/page.tsx        # AI Reports
│   ├── upload/page.tsx         # File Upload
│   ├── projects/page.tsx       # Projects
│   ├── settings/page.tsx       # Settings
│   ├── api/upload/route.ts     # Upload API
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   ├── layout/
│   │   ├── Layout.tsx          # Main layout wrapper
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   └── TopNav.tsx          # Top navigation bar
│   ├── dashboard/
│   │   ├── KPICard.tsx         # KPI metric card
│   │   ├── PainPointsCard.tsx  # Pain points display
│   │   └── UploadStatus.tsx    # Recent uploads
│   ├── UploadZone.tsx          # File upload component
│   └── ui/button.tsx           # Reusable button
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── utils.ts                # Utility functions
│   ├── sampleData.ts           # Mock data generator
│   ├── fileParser.ts           # File parsing utilities
│   ├── aiService.ts            # AI integration service
│   ├── db.ts                   # Database types
│   └── supabase.ts             # Supabase client
├── public/                      # Static assets
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies

```

### 🎯 Features Breakdown

**Module 1: Foundation** ✅
- Next.js setup with TypeScript & Tailwind
- Navigation and layout components
- Dark mode support
- 8 main pages

**Module 2: Dashboard** ✅
- Executive dashboard with KPIs
- Sample data generation
- Charts and visualizations
- Responsive grid layout

**Module 3: File Upload** ✅
- Drag-drop file upload
- File validation
- Progress tracking
- Support for PDF, TXT, CSV, DOCX

**Module 4: AI Processing** (Ready for implementation)
- Pain point extraction
- Theme clustering
- Sentiment analysis
- Confidence scoring
- Requires: OpenAI/Claude API key

**Module 5: AI Query Assistant** (Ready for implementation)
- Natural language questions
- RAG-powered answers
- Evidence-backed responses
- Requires: Vector embeddings

**Module 6+: Advanced Features** (Future)
- Analytics correlation
- Risk monitoring
- Report generation
- Sticky notes collaboration
- Meeting intelligence

### 🔐 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=sk-...
```

### 🚀 Next Steps to Complete the MVP

1. **Integrate OpenAI/Claude API** for AI processing
2. **Setup Supabase PostgreSQL** for data persistence
3. **Implement vector embeddings** with pgvector
4. **Build RAG pipeline** for query assistant
5. **Deploy to Vercel** for public access
6. **Add authentication** (optional for hackathon)

### 📊 Current Capabilities

✅ File upload and processing  
✅ Dashboard visualization  
✅ Sample data display  
✅ Dark/light mode  
✅ Responsive design  
✅ Navigation structure  

⏳ In Development:
- AI inference (waiting for LLM choice)
- Database integration (waiting for Supabase setup)
- Real analytics correlation  
- Report generation  

### 🤝 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  Dashboard | Insights | Analytics | Risk | Reports      │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              API Routes & Services                       │
│  Upload | Process | Query | Analyze | Generate          │
└──────────────────────┬──────────────────────────────────┘
                       │
           ┌───────────┼───────────┐
           ▼           ▼           ▼
      ┌────────┐ ┌──────────┐ ┌────────┐
      │Supabase│ │OpenAI/  │ │pgvector│
      │ PostgreSQL│ Claude  │ │Embeddings│
      └────────┘ └──────────┘ └────────┘
```

### 📝 Notes

- This is a hackathon MVP with focus on UI and core functionality
- Sample data is used for demo purposes
- Real AI integration requires API keys
- Database integration requires Supabase project
- All components are production-ready and can be extended

### 🎨 Design Philosophy

- Premium SaaS aesthetic
- Data-forward interface
- Evidence-based insights
- User-centric workflows
- Performance-optimized
- Accessibility-friendly

### 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (responsive design)

---

**Built with ❤️ for the AI Agent Hackathon**
