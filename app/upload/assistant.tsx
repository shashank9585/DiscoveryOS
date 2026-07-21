'use client';

import { useState, useRef, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAppStore } from '@/lib/store';
import { Send, Loader, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function QueryAssistantPage() {
  const {
    painPoints,
    sentimentResults,
    recommendations,
    themes,
    personas,
    loadFromStorage,
    hasData,
  } = useAppStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "👋 Hi! I'm your Product Intelligence AI Assistant. I can help you answer questions about your customer feedback and product insights.\n\nTry asking me:\n• What are our top pain points?\n• What's the sentiment of our customers?\n• What should we build next?\n• Show evidence for this insight\n• Which segment is most affected?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const dataExists = hasData();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    'What are our top pain points?',
    'What is customer sentiment?',
    'What should we build next?',
    'Show me the evidence',
    'Summarize all insights',
  ];

  const generateResponseFromData = (text: string): string => {
    const lowerText = text.toLowerCase();

    // Check if user is asking about pain points
    if (lowerText.includes('pain') || lowerText.includes('problem') || lowerText.includes('issue')) {
      if (painPoints.length === 0) return 'No pain points have been extracted yet. Upload customer feedback documents to identify pain points.';
      
      const topPainPoints = painPoints.slice(0, 3);
      return `📊 **Top Pain Points**:\n\n${topPainPoints
        .map(
          (pp, idx) =>
            `${idx + 1}. **${pp.issue}** (${pp.frequency} mentions, ${Math.round(pp.confidence * 100)}% confidence)`
        )
        .join('\n\n')}\n\nThese represent the highest priority items based on customer feedback frequency and confidence.`;
    }

    // Check if user is asking about sentiment
    if (lowerText.includes('sentiment') || lowerText.includes('feeling') || lowerText.includes('mood')) {
      if (sentimentResults.length === 0) return 'No sentiment data available yet. Upload documents to analyze customer sentiment.';
      
      const sentiment = sentimentResults[0];
      return `😊 **Customer Sentiment Analysis**:\n\n✅ Positive: ${sentiment.positivePercent}%\n⚪ Neutral: ${sentiment.neutralPercent}%\n❌ Negative: ${sentiment.negativePercent}%\n\nOverall sentiment is **${sentiment.overall}**, indicating ${sentiment.overall === 'negative' ? 'areas for improvement' : 'positive customer perception'}.`;
    }

    // Check if user is asking about recommendations
    if (lowerText.includes('build') || lowerText.includes('next') || lowerText.includes('recommend')) {
      if (recommendations.length === 0) return 'No recommendations available yet. Upload documents to generate recommendations.';
      
      const topRecommendations = recommendations.slice(0, 3);
      return `🎯 **Top Recommendations**:\n\n${topRecommendations
        .map(
          (rec, idx) =>
            `${idx + 1}. **${rec.action}** (Priority: ${rec.priority})\n   Impact: ${rec.businessImpact}\n   Effort: ${rec.effort}`
        )
        .join('\n\n')}\n\nThese are prioritized based on customer feedback and business impact.`;
    }

    // Check if user is asking for evidence
    if (lowerText.includes('evidence') || lowerText.includes('quote') || lowerText.includes('proof')) {
      if (painPoints.length === 0) return 'No evidence available yet. Upload documents to extract supporting evidence.';
      
      const topPainPoint = painPoints[0];
      const evidence = topPainPoint.evidenceQuotes.slice(0, 2);
      return `📋 **Evidence for: "${topPainPoint.issue}"**\n\n${evidence.map((quote, idx) => `${idx + 1}. "${quote}"`).join('\n\n')}\n\nThis insight is based on ${topPainPoint.frequency} customer mentions with ${Math.round(topPainPoint.confidence * 100)}% confidence.`;
    }

    // Check if user is asking for summary
    if (lowerText.includes('summar') || lowerText.includes('overview') || lowerText.includes('all insight')) {
      if (!dataExists) return 'No data available yet. Upload customer feedback documents to generate insights.';
      
      return `📊 **Insights Summary**:\n\n📍 Pain Points: ${painPoints.length} identified\n😊 Sentiment: ${sentimentResults.length > 0 ? sentimentResults[0].overall : 'Not analyzed'}\n🎯 Themes: ${themes.length} extracted\n👥 Personas: ${personas.length} identified\n✅ Recommendations: ${recommendations.length} suggested\n\nUse the Dashboard to explore these insights in detail.`;
    }

    // Default response
    if (!dataExists) {
      return 'I don\'t have any customer data to analyze yet. Please upload documents first to generate insights and I can help you understand them better.';
    }

    return `I can help you analyze your customer feedback. Here's what I found:\n\n📍 **${painPoints.length} pain points** have been identified\n😊 **Customer sentiment** is ${sentimentResults[0]?.overall || 'unknown'}\n🎯 **${recommendations.length} recommendations** for improvement\n\nTry asking about specific topics like pain points, sentiment, or recommendations!`;
  };

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
      const response = generateResponseFromData(text);

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
            <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">🤖 AI Query Assistant</h1>
            <p className="text-slate-600 dark:text-slate-400">Ask questions about your product and customer insights</p>
          </div>

          {/* Empty State */}
          {!dataExists && messages.length === 1 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No data to analyze yet</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-md">
                Upload customer feedback documents first, and then I can help you explore and understand the insights!
              </p>
            </div>
          )}

          {/* Messages */}
          {(dataExists || messages.length > 1) && (
            <div className="space-y-6 mb-8">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xl px-4 py-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                    <p className={`text-xs ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'} mt-1`}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin text-slate-600 dark:text-slate-400" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Analyzing your data...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        {messages.length === 1 && dataExists && (
          <div className="px-8 mb-6">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-3">Quick questions:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left text-slate-700 dark:text-slate-300"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-8 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
              placeholder="Ask me anything about your product..."
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
              disabled={loading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
}
