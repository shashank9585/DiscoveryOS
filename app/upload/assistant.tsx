'use client';

import { useState, useRef, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { getSampleDashboardData } from '@/lib/sampleData';
import { Send, Loader } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function QueryAssistantPage() {
  const data = getSampleDashboardData();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "👋 Hi! I'm your Product Intelligence AI Assistant. I can help you answer questions about your customer feedback and product insights.\n\nTry asking me:\n• What should we build next?\n• Why are users leaving?\n• What is our biggest pain point?\n• Compare [segment A] vs [segment B]\n• Show evidence for this recommendation",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    'What should we build next?',
    'Why are customers leaving?',
    'What is our biggest pain point?',
    'Show me the evidence',
    'Which segment is most affected?',
  ];

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responses: Record<string, string> = {
        default:
          "Based on your customer feedback analysis:\n\n📊 **Key Insight**: The primary issue is onboarding complexity, mentioned by 34 customers (95% confidence). This directly correlates with your 67% signup drop-off.\n\n✅ **Recommended Action**: Redesign the onboarding flow. Estimated impact: 10-15% churn reduction.\n\n📈 **Business Case**: This improvement could recover ~$50K in monthly revenue.",
        build:
          "Based on customer feedback analysis, here are your top 3 priorities:\n\n**1. 🎯 Onboarding Redesign (CRITICAL)**\n- Mentioned by 34 customers\n- 95% confidence\n- Impact: Reduce churn by 10-15%\n- Effort: 3-4 weeks\n\n**2. ⚡ Performance Optimization (HIGH)**\n- 28 customer complaints\n- 88% confidence\n- Impact: +15% session duration\n- Effort: 2-3 weeks\n\n**3. 📱 Mobile Experience (HIGH)**\n- 18 feature requests\n- 82% confidence\n- Impact: +30% revenue potential\n- Effort: 4-6 weeks",
        churn:
          "🔴 **Churn Analysis**: Customers are leaving due to:\n\n1. **Onboarding friction (40%)** - Users get stuck during setup\n2. **Performance issues (28%)** - App slowness frustrates users\n3. **Mobile gap (22%)** - Can't use on-the-go\n4. **Feature gaps (10%)** - Limited customization\n\n💡 **Why this matters**: Churn increased 8% → 12% MoM, representing $50-150K revenue at risk.\n\n✅ **Quick win**: Fix onboarding first. Fast to implement, highest impact.",
        pain:
          "🔍 **Top Pain Points (Ranked by Frequency & Confidence)**:\n\n1. **Onboarding Complexity** (34 mentions, 95% confidence) - Users struggle with initial setup\n2. **Performance Issues** (28 mentions, 88% confidence) - Application is slow\n3. **Mobile Gap** (18 mentions, 82% confidence) - No mobile app available\n4. **Limited Customization** (12 mentions, 75% confidence) - Customers want more options\n5. **Poor Documentation** (8 mentions, 70% confidence) - API docs are incomplete\n\n📊 These issues affect 80% of new users.",
        evidence:
          "📋 **Supporting Evidence**:\n\n**For Onboarding Issues:**\n- \"Getting started is really confusing\" - Enterprise customer\n- \"Took me 2 hours to understand the basics\" - SMB customer\n- \"The onboarding process is overwhelming\" - Startup customer\n\n**Customer Impact**: 67% of signup attempts don't complete\n**Business Impact**: Direct correlation with 12% churn rate\n\n**Confidence**: 95% - This is our most critical insight.",
      };

      const lowerText = text.toLowerCase();
      let response = responses.default;

      if (lowerText.includes('build') || lowerText.includes('next'))
        response = responses.build;
      else if (lowerText.includes('churn') || lowerText.includes('leaving'))
        response = responses.churn;
      else if (lowerText.includes('pain') || lowerText.includes('problem'))
        response = responses.pain;
      else if (lowerText.includes('evidence') || lowerText.includes('quote'))
        response = responses.evidence;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      <main className="flex-1 overflow-auto bg-background flex flex-col">
        <div className="p-8 flex-1 overflow-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">🤖 AI Query Assistant</h1>
            <p className="text-muted-foreground">Ask questions about your product and customer insights</p>
          </div>

          {/* Messages */}
          <div className="space-y-6 mb-8">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xl px-4 py-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted border'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                  <p className="text-xs opacity-50 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted border px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Analyzing your data...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Prompts */}
        {messages.length === 1 && (
          <div className="px-8 mb-6">
            <p className="text-xs font-medium text-muted-foreground mb-3">Quick questions:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-xs px-3 py-2 border rounded-lg hover:bg-muted transition text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-8 border-t bg-card">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
              placeholder="Ask me anything about your product..."
              className="flex-1 px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
}
