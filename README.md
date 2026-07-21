<div align="center">

# 🚀 DiscoveryOS

### AI Product Discovery & User Research Intelligence Platform

**Transform scattered customer feedback into evidence-backed product decisions.**

Built for the **Product Space × CodeBenders Agentic AI Hackathon 2026**

<br>

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Groq](https://img.shields.io/badge/Groq-Llama%203.3-orange?style=for-the-badge)](https://groq.com/)
[![Vercel](https://img.shields.io/badge/Hosted-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

### 🌐 Live Demo

https://discoveryos-weld.vercel.app/

</div>

---

# 📖 Overview

Product teams receive customer feedback from dozens of different sources every day—customer interviews, support tickets, surveys, feature requests, meeting notes, analytics platforms, research documents, and internal discussions.

While this information is valuable, it usually remains scattered across multiple tools and formats. By the time roadmap planning begins, teams often rely on assumptions or memory instead of actual customer evidence.

**DiscoveryOS** solves this challenge by acting as an AI-powered Product Intelligence platform that converts unstructured customer feedback into structured insights, identifies recurring customer problems, correlates qualitative feedback with quantitative analytics, and generates evidence-backed recommendations for better product decisions.

Instead of simply summarizing documents, DiscoveryOS helps product teams discover **what customers truly need, why it matters, and what should be built next.**

---

# 🎯 The Problem

Modern product organizations constantly collect customer knowledge from:

- Customer Interviews
- Product Research
- Support Tickets
- Feature Requests
- Survey Responses
- Meeting Notes
- Product Analytics
- Internal Documentation

Unfortunately these insights remain fragmented.

As a result,

- Teams manually read hundreds of documents.
- Important insights get lost.
- Roadmaps are based on opinions instead of evidence.
- Engineering effort is often spent solving lower-impact problems.
- Product managers struggle to connect customer feedback with business metrics.

---

# 💡 Our Solution

DiscoveryOS brings every research source into one intelligent workspace.

Using AI, it automatically:

- Extracts customer pain points
- Groups similar feedback into themes
- Detects customer personas
- Performs sentiment analysis
- Measures issue frequency
- Correlates customer feedback with analytics
- Prioritizes opportunities based on business impact
- Generates executive-ready product reports

The result is a centralized Product Intelligence platform that helps organizations make faster and smarter roadmap decisions.

---

# ✨ Key Features

## 📂 Multi-source Research Upload

Upload research from multiple sources including:

- PDF
- DOCX
- TXT
- CSV

The platform parses documents and prepares them for AI processing.

---

## 🧠 AI Insight Engine

Powered using **Groq Llama 3.3** for high-speed inference.

The AI automatically identifies:

- Customer Pain Points
- Product Themes
- User Personas
- Feature Requests
- Sentiment
- Business Impact
- Confidence Scores
- Executive Recommendations

Rather than generating simple summaries, DiscoveryOS produces structured product intelligence.

---

## 📊 Executive Dashboard

A centralized dashboard designed for Product Managers and leadership teams.

Monitor:

- Product Health Score
- Customer Satisfaction
- AI Confidence
- Active Product Risks
- Top Customer Pain Points
- Recent Upload Activity
- Executive KPIs

---

## 📈 Product Analytics Dashboard

Bridge qualitative customer feedback with quantitative analytics.

Track metrics such as:

- Bounce Rate
- Conversion Rate
- Churn
- Session Duration
- Funnel Drop-offs

The platform correlates analytics data with customer conversations to identify the true causes behind product issues.

Example:

Customer complains about onboarding

⬇

Analytics show 67% signup drop-off

⬇

DiscoveryOS recommends onboarding redesign as highest priority.

---

## 💬 Customer Insights Dashboard

Explore customer intelligence through:

- Pain Point Frequency
- Theme Distribution
- Persona Analysis
- Sentiment Breakdown
- Confidence Scores
- Search & Filters

Helping teams quickly understand what customers consistently experience.

---

## ⚠️ AI Risk Intelligence

Detect business risks before they become critical.

Examples include:

- Rising Churn
- Negative Sentiment Growth
- Feature Adoption Decline
- Increasing Support Volume

Each risk includes:

- Severity
- Confidence
- Timeline
- Business Impact
- Recommended Actions

---

## 📑 AI Reports

Automatically generate executive-ready reports containing:

- Executive Summary
- Product Health
- Top Pain Points
- Customer Segments
- Risk Analysis
- Recommendations
- Suggested Roadmap Priorities

Designed for Product Managers, Leadership Teams, and Stakeholders.

---

## 📁 Project Workspace

Manage research project-wise.

Each project stores:

- Uploaded Files
- Insights
- Reports
- Analytics
- AI Recommendations

---

## 🤖 AI Assistant

Ask natural language questions such as:

> Why are customers dropping during onboarding?

> What should we prioritize next sprint?

> Which customer segment is most affected?

The assistant responds with evidence-backed answers generated from uploaded research.

---

## ⚙️ Settings

Configure:

- API Keys
- AI Provider
- Preferences
- Notifications

---

# 🔄 AI Workflow

```text
Customer Interviews
Support Tickets
Survey Responses
Meeting Notes
Analytics Data
Research Documents

           │

           ▼

    Upload Research Files

           │

           ▼

      Document Parsing

           │

           ▼

      Groq AI Processing

           │

           ▼

   Pain Point Extraction

           │

           ▼

     Theme Clustering

           │

           ▼

 Persona Identification

           │

           ▼

   Sentiment Analysis

           │

           ▼

 Business Impact Scoring

           │

           ▼

 Executive Dashboards

           │

           ▼

 Evidence-backed Recommendations
```

---

# 🏗️ System Architecture

```text
                    DiscoveryOS

                    Frontend
               (Next.js + React)

                        │

                        ▼

              File Upload & Parsing

                        │

                        ▼

             Groq Llama 3.3 AI Engine

                        │

                        ▼

          Insight Extraction Pipeline

        ├── Pain Points
        ├── Themes
        ├── Personas
        ├── Sentiment
        ├── Recommendations

                        │

                        ▼

          Executive Dashboards & Reports

                        │

                        ▼

              AI Query Assistant
```

---

# 🛠️ Technology Stack

| Category | Technology |
|------------|------------|
| Frontend | Next.js 16 |
| UI | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Charts | Recharts |
| AI | Groq API (Llama 3.3 70B Versatile) |
| File Parsing | pdf-parse, mammoth, papaparse |
| State Management | Zustand |
| Deployment | Vercel |

---

# 📂 Project Structure

```text
DiscoveryOS/

├── app/
│   ├── Dashboard
│   ├── Analytics
│   ├── Insights
│   ├── Risk
│   ├── Reports
│   ├── Upload
│   ├── Projects
│   ├── Settings
│   └── API Routes
│
├── components/
│
├── lib/
│
├── public/
│
├── styles/
│
└── configuration files
```

---

# 🚀 Getting Started

Clone the repository

```bash
git clone https://github.com/shashank9585/DiscoveryOS.git
```

Move into the project

```bash
cd DiscoveryOS
```

Install dependencies

```bash
npm install
```

Create a `.env.local` file

```env
GROQ_API_KEY=YOUR_API_KEY
```

Run locally

```bash
npm run dev
```

Visit

```
http://localhost:3000
```

---

# 📦 Current MVP

✅ Executive Dashboard

✅ Customer Insights

✅ Product Analytics

✅ Risk Dashboard

✅ AI Reports

✅ AI Assistant

✅ Project Workspace

✅ File Upload

✅ Responsive Design

✅ Dark Mode

✅ Groq AI Integration

✅ Multi-format File Parsing

---

# 🚀 Future Roadmap

- Google Analytics Integration
- Jira Integration
- Zendesk Integration
- Slack Integration
- Notion Integration
- Google Meet Transcript Import
- Google Calendar Action Items
- Team Collaboration
- Sticky Notes Workspace
- Vector Search (pgvector)
- Sprint Planning Assistant
- PRD Generation
- AI Roadmap Builder
- Multi-user Workspaces

---

# 🎯 Target Users

- Product Managers
- Startup Founders
- Product Teams
- UX Researchers
- Customer Success Teams
- Product Analysts

---

# 🏆 Hackathon Submission

**Hackathon**

**Product Space × CodeBenders Agentic AI Hackathon 2026**

### Submission Includes

- ✅ Working AI Prototype
- ✅ Live Deployment
- ✅ AI-powered Insight Extraction
- ✅ Executive Dashboards
- ✅ Product Analytics
- ✅ Risk Intelligence
- ✅ AI Reports
- ✅ Responsive SaaS Interface

---

# 👨‍💻 Developer

## Shashank H E

AI Builder • Product Developer 

**GitHub**

https://github.com/shashank9585

**LinkedIn**

https://www.linkedin.com/in/shashank-h-e/

---

# 💭 Vision

> Product teams shouldn't spend hours searching for customer feedback.

> They should spend their time building products customers truly need.

**DiscoveryOS transforms scattered customer conversations into actionable product intelligence—helping teams build with confidence, backed by evidence instead of assumptions.**

---

<div align="center">

### ⭐ If you found this project interesting, consider giving it a Star!

**Built with ❤️ for the Product Space × CodeBenders Agentic AI Hackathon 2026**

</div>
