## DiscoveryOS - Complete Technical Blueprint

### 🗄️ Database Schema (Supabase PostgreSQL)

Copy and paste these into Supabase SQL editor to set up:

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER,
  content TEXT,
  source_type VARCHAR(50), -- 'interview', 'survey', 'support_ticket', 'email', 'analytics'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id),
  processed BOOLEAN DEFAULT FALSE,
  processing_status VARCHAR(50), -- 'pending', 'processing', 'completed', 'error'
  INDEX documents_project_idx (project_id)
);

-- Document chunks (for chunking large documents)
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  chunk_index INTEGER,
  content TEXT NOT NULL,
  embedding VECTOR(1536), -- OpenAI embeddings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX chunks_document_idx (document_id),
  INDEX chunks_embedding_idx USING ivfflat (embedding vector_cosine_ops)
);

-- Pain points extraction
CREATE TABLE pain_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  frequency INTEGER DEFAULT 1, -- How many times mentioned
  sentiment VARCHAR(50), -- 'negative', 'critical', 'concern'
  business_impact_score NUMERIC(5,2), -- 0-100
  customer_impact_score NUMERIC(5,2), -- 0-100
  confidence_score NUMERIC(5,2), -- 0-100
  customer_segment VARCHAR(100),
  affected_personas TEXT[], -- Array of persona IDs
  source_quotes TEXT[], -- Array of direct quotes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX pain_points_project_idx (project_id)
);

-- Themes and clusters
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  pain_point_ids UUID[] NOT NULL, -- Array of related pain point IDs
  frequency INTEGER,
  confidence_score NUMERIC(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX themes_project_idx (project_id)
);

-- Customer personas
CREATE TABLE personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  segment VARCHAR(100),
  characteristics TEXT[],
  top_pain_points UUID[],
  sentiment_score NUMERIC(5,2),
  frequency INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX personas_project_idx (project_id)
);

-- Analytics metrics
CREATE TABLE analytics_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  metric_type VARCHAR(100), -- 'conversion', 'bounce_rate', 'churn', 'retention', 'dau', 'mau'
  metric_name VARCHAR(255),
  value NUMERIC(10,4),
  timestamp TIMESTAMP WITH TIME ZONE,
  segment VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX metrics_project_idx (project_id),
  INDEX metrics_type_idx (metric_type)
);

-- Correlations (linking pain points to analytics)
CREATE TABLE correlations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  pain_point_id UUID REFERENCES pain_points(id) ON DELETE CASCADE,
  metric_id UUID REFERENCES analytics_metrics(id) ON DELETE CASCADE,
  correlation_strength NUMERIC(5,2), -- -1 to 1
  confidence_score NUMERIC(5,2),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX correlations_project_idx (project_id)
);

-- Recommendations
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  recommendation_type VARCHAR(50), -- 'feature', 'improvement', 'fix', 'optimization'
  priority VARCHAR(50), -- 'critical', 'high', 'medium', 'low'
  confidence_score NUMERIC(5,2),
  business_impact_score NUMERIC(5,2),
  customer_impact_score NUMERIC(5,2),
  effort_estimate VARCHAR(50), -- 'small', 'medium', 'large'
  supporting_evidence TEXT[],
  related_pain_points UUID[],
  related_metrics UUID[],
  estimated_impact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX recommendations_project_idx (project_id)
);

-- Reports
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  report_type VARCHAR(100), -- 'executive_summary', 'product_discovery', 'risk_assessment', 'roadmap'
  title VARCHAR(255),
  content JSONB, -- Structured report data
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  generated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX reports_project_idx (project_id)
);

-- Sticky notes
CREATE TABLE sticky_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  priority VARCHAR(50), -- 'high', 'medium', 'low'
  color VARCHAR(50), -- 'yellow', 'blue', 'pink', 'green'
  position_x INTEGER,
  position_y INTEGER,
  linked_item_type VARCHAR(50), -- 'pain_point', 'recommendation', 'insight'
  linked_item_id UUID,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX notes_project_idx (project_id)
);

-- Create indexes for performance
CREATE INDEX idx_pain_points_score ON pain_points(business_impact_score DESC);
CREATE INDEX idx_recommendations_priority ON recommendations(priority);
CREATE INDEX idx_themes_frequency ON themes(frequency DESC);

-- Enable Row Level Security (optional)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_points ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own projects"
ON projects FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create projects"
ON projects FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

---

### 🤖 AI Workflow

#### Step 1: Document Upload & Parsing

```javascript
// app/api/upload/route.ts
const parseDocument = async (file: File) => {
  const content = await parseFile(file); // PDF, TXT, CSV, DOCX
  const chunks = chunkText(content, 2000, 100); // 2000 char chunks, 100 overlap
  
  return {
    filename: file.name,
    content,
    chunks,
    file_type: file.type,
    file_size: file.size
  };
};
```

#### Step 2: Generate Embeddings

```javascript
// lib/aiService.ts - Function to create embeddings
const generateEmbeddings = async (chunks: string[]) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: chunks
  });
  
  return response.data.map(item => item.embedding);
};
```

#### Step 3: Extract Insights Using LLM

```javascript
// lib/aiService.ts - Main extraction function
const extractInsights = async (content: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "user",
      content: `
        Analyze this customer feedback and extract:
        1. Top 5 pain points (title, description, severity 1-10, sentiment)
        2. Key themes (group related issues)
        3. Customer personas (based on language/context)
        4. Overall sentiment (positive/negative/neutral)
        5. Suggested business impact (0-100)
        
        Format as JSON.
        
        Content: ${content}
      `
    }]
  });
  
  return JSON.parse(response.choices[0].message.content);
};
```

#### Step 4: Correlate with Analytics

```javascript
// lib/aiService.ts
const correlateWithAnalytics = async (
  painPoints: PainPoint[],
  metrics: AnalyticsMetric[]
) => {
  const correlations = [];
  
  for (const painPoint of painPoints) {
    for (const metric of metrics) {
      // Check for correlation patterns
      const correlation = await detectCorrelation(painPoint, metric);
      if (correlation.strength > 0.7) {
        correlations.push({
          pain_point_id: painPoint.id,
          metric_id: metric.id,
          correlation_strength: correlation.strength,
          confidence_score: correlation.confidence,
          description: correlation.explanation
        });
      }
    }
  }
  
  return correlations;
};
```

#### Step 5: Generate Recommendations

```javascript
// lib/aiService.ts
const generateRecommendations = async (
  painPoints: PainPoint[],
  correlations: Correlation[],
  metrics: AnalyticsMetric[]
) => {
  const prompt = `
    Given these customer pain points and metrics, generate 3-5 product recommendations:
    
    Pain Points: ${JSON.stringify(painPoints)}
    Analytics: ${JSON.stringify(metrics)}
    Correlations: ${JSON.stringify(correlations)}
    
    For each recommendation, provide:
    - Title
    - Description
    - Type (feature/improvement/fix)
    - Priority (critical/high/medium/low)
    - Confidence (0-100%)
    - Business impact (0-100)
    - Customer impact (0-100)
    - Effort (small/medium/large)
    - Supporting evidence
    
    Format as JSON array.
  `;
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }]
  });
  
  return JSON.parse(response.choices[0].message.content);
};
```

#### Step 6: Query Assistant (RAG)

```javascript
// lib/aiService.ts
const queryAssistant = async (
  question: string,
  projectData: ProjectData
) => {
  // 1. Embed the question
  const questionEmbedding = await generateEmbeddings([question]);
  
  // 2. Find similar chunks (RAG retrieval)
  const relevantChunks = await supabase
    .rpc('match_documents', {
      embedding: questionEmbedding[0],
      match_threshold: 0.7,
      match_count: 5
    });
  
  // 3. Build context
  const context = relevantChunks.map(c => c.content).join('\n\n');
  
  // 4. Generate answer with context
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "user",
      content: `
        You are a product intelligence assistant. Answer the question using ONLY the provided context.
        
        Context:
        ${context}
        
        Question: ${question}
        
        Provide:
        1. Direct answer
        2. Key evidence/quotes
        3. Confidence level
        4. Related insights
      `
    }]
  });
  
  return {
    answer: response.choices[0].message.content,
    sources: relevantChunks,
    confidence: calculateConfidence(relevantChunks)
  };
};
```

---

### 📊 API Endpoints Ready to Implement

```
POST   /api/upload              - Upload document
POST   /api/projects            - Create project
GET    /api/projects            - List projects
GET    /api/projects/:id        - Get project
POST   /api/extract-insights    - Extract insights from document
POST   /api/recommendations     - Generate recommendations
POST   /api/query               - Query assistant
GET    /api/analytics           - Get metrics
POST   /api/reports/generate    - Generate report
GET    /api/reports             - List reports
```

---

### 🎯 Quick Integration Checklist

- [ ] Create Supabase project
- [ ] Run migration SQL
- [ ] Get OpenAI/Claude API key
- [ ] Add env variables to .env.local
- [ ] Update aiService.ts with real API calls
- [ ] Update upload endpoint to save to database
- [ ] Update dashboard pages to fetch from database
- [ ] Test file upload → extraction → display flow
- [ ] Deploy to Vercel

**Est. Time: 2-4 hours to complete**

---

### 🚀 Sample Implementation

See `lib/aiService.ts` and `lib/db.ts` for complete service layer ready to connect.
