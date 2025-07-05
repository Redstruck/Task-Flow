import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Lightbulb, TrendingUp, Clock, Target, X, Mic, MicOff } from 'lucide-react';
import { Task, TodoList, AISuggestion } from '../types';

interface AIAssistantProps {
  lists: TodoList[];
  onApplySuggestion: (suggestion: AISuggestion, taskId?: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  lists,
  onApplySuggestion,
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; suggestions?: AISuggestion[] }>>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI productivity assistant. I can help you optimize your tasks, suggest priorities, estimate time, and provide insights to boost your productivity. What would you like help with today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateAISuggestions = (query: string): AISuggestion[] => {
    const allTasks = lists.flatMap(list => list.tasks);
    const suggestions: AISuggestion[] = [];

    // Analyze query and generate relevant suggestions
    if (query.toLowerCase().includes('priority') || query.toLowerCase().includes('important')) {
      const highPriorityTasks = allTasks.filter(task => !task.completed && task.priority !== 'high');
      if (highPriorityTasks.length > 0) {
        suggestions.push({
          id: Date.now().toString(),
          type: 'priority',
          suggestion: `Consider increasing priority for "${highPriorityTasks[0].title}" based on its due date and dependencies.`,
          confidence: 0.85,
          reasoning: 'This task has an approaching deadline and blocks other work.',
          createdAt: new Date(),
        });
      }
    }

    if (query.toLowerCase().includes('time') || query.toLowerCase().includes('estimate')) {
      const tasksWithoutEstimates = allTasks.filter(task => !task.completed && !task.estimatedTime);
      if (tasksWithoutEstimates.length > 0) {
        suggestions.push({
          id: (Date.now() + 1).toString(),
          type: 'time_estimate',
          suggestion: `Based on similar tasks, "${tasksWithoutEstimates[0].title}" should take approximately 45 minutes.`,
          confidence: 0.78,
          reasoning: 'Analysis of similar completed tasks with comparable complexity.',
          createdAt: new Date(),
        });
      }
    }

    if (query.toLowerCase().includes('optimize') || query.toLowerCase().includes('productivity')) {
      suggestions.push({
        id: (Date.now() + 2).toString(),
        type: 'optimization',
        suggestion: 'Schedule your high-priority tasks during your peak hours (9-11 AM) for 23% better performance.',
        confidence: 0.92,
        reasoning: 'Your productivity data shows highest focus and completion rates during morning hours.',
        createdAt: new Date(),
      });
    }

    return suggestions;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      const suggestions = generateAISuggestions(input);
      const responses = [
        "I've analyzed your tasks and found some optimization opportunities. Here are my recommendations:",
        "Based on your productivity patterns, I suggest the following improvements:",
        "I've identified some areas where you can boost your efficiency:",
        "Here are some AI-powered insights to help you work smarter:",
      ];

      const assistantMessage = {
        role: 'assistant' as const,
        content: responses[Math.floor(Math.random() * responses.length)],
        suggestions,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.start();
    }
  };

  const quickActions = [
    { icon: Target, label: 'Optimize Priorities', query: 'Help me optimize my task priorities' },
    { icon: Clock, label: 'Time Estimates', query: 'Suggest time estimates for my tasks' },
    { icon: TrendingUp, label: 'Productivity Tips', query: 'Give me productivity optimization tips' },
    { icon: Lightbulb, label: 'Task Breakdown', query: 'Help me break down complex tasks' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 w-full max-w-4xl h-[80vh] flex flex-col animate-in slide-in-from-bottom-2 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">AI Assistant</h2>
              <p className="text-sm text-gray-600">Your intelligent productivity companion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-200/50">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInput(action.query)}
                className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-xl hover:from-purple-200 hover:to-pink-200 transition-all duration-200 text-sm font-medium"
              >
                <action.icon className="w-4 h-4" />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl ${
                message.role === 'user' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                  : 'bg-gray-100'
              } rounded-2xl p-4`}>
                <p className={`text-sm ${message.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
                  {message.content}
                </p>
                
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {message.suggestions.map((suggestion) => (
                      <div key={suggestion.id} className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-4 h-4 text-purple-500" />
                            <span className="text-sm font-medium text-gray-900 capitalize">
                              {suggestion.type.replace('_', ' ')} Suggestion
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {Math.round(suggestion.confidence * 100)}% confidence
                            </span>
                            <button
                              onClick={() => onApplySuggestion(suggestion)}
                              className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 text-xs font-medium"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{suggestion.suggestion}</p>
                        <p className="text-xs text-gray-500">{suggestion.reasoning}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl p-4">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything about your tasks and productivity..."
                className="w-full px-4 py-3 pr-12 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              />
              <button
                onClick={handleVoiceInput}
                className={`absolute right-3 top-3 p-1 rounded-lg transition-colors ${
                  isListening ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-purple-500 hover:bg-purple-50'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;