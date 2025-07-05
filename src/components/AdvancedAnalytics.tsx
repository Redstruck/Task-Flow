import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Clock, Target, Users, Calendar, X, Download, Filter, Brain, Zap, AlertTriangle } from 'lucide-react';
import { TodoList, AnalyticsData, Task, AIInsight } from '../types';
import { getAnalyticsData, getProductivityTrends } from '../utils/analyticsUtils';

interface AdvancedAnalyticsProps {
  lists: TodoList[];
  isOpen: boolean;
  onClose: () => void;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ lists, isOpen, onClose }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedMetric, setSelectedMetric] = useState<'productivity' | 'time' | 'completion' | 'collaboration' | 'ai' | 'quality'>('productivity');
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'predictions' | 'benchmarks'>('overview');

  const analytics = useMemo(() => getAnalyticsData(lists, timeRange), [lists, timeRange]);
  const trends = useMemo(() => getProductivityTrends(lists, timeRange), [lists, timeRange]);

  // Generate AI insights
  const aiInsights: AIInsight[] = useMemo(() => [
    {
      id: '1',
      type: 'productivity_trend',
      title: 'Productivity Declining',
      description: 'Your task completion rate has decreased by 15% over the past week. Consider reviewing your workload distribution.',
      severity: 'warning',
      actionable: true,
      suggestions: ['Reduce meeting time by 30%', 'Focus on high-priority tasks first', 'Use time-blocking for deep work'],
      createdAt: new Date(),
    },
    {
      id: '2',
      type: 'bottleneck_detection',
      title: 'Bottleneck Detected',
      description: 'Tasks are accumulating in the "Review" stage. This is causing delays in your workflow.',
      severity: 'critical',
      actionable: true,
      suggestions: ['Allocate more time for reviews', 'Delegate review tasks', 'Streamline review process'],
      createdAt: new Date(),
    },
    {
      id: '3',
      type: 'workload_balance',
      title: 'Workload Imbalance',
      description: 'You have 3x more high-priority tasks than usual. Consider redistributing or rescheduling some tasks.',
      severity: 'warning',
      actionable: true,
      suggestions: ['Delegate 2-3 medium priority tasks', 'Extend deadlines where possible', 'Focus on impact over quantity'],
      createdAt: new Date(),
    },
  ], []);

  if (!isOpen) return null;

  const MetricCard = ({ title, value, change, icon: Icon, color, subtitle }: {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
  }) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-sm ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className={`w-4 h-4 ${change < 0 ? 'rotate-180' : ''}`} />
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  const AIInsightCard = ({ insight }: { insight: AIInsight }) => (
    <div className={`p-4 rounded-xl border-l-4 ${
      insight.severity === 'critical' ? 'bg-red-50 border-red-500' :
      insight.severity === 'warning' ? 'bg-yellow-50 border-yellow-500' :
      'bg-blue-50 border-blue-500'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Brain className={`w-5 h-5 ${
            insight.severity === 'critical' ? 'text-red-600' :
            insight.severity === 'warning' ? 'text-yellow-600' :
            'text-blue-600'
          }`} />
          <h4 className="font-semibold text-gray-900">{insight.title}</h4>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          insight.severity === 'critical' ? 'bg-red-100 text-red-800' :
          insight.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {insight.severity}
        </span>
      </div>
      <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
      {insight.actionable && insight.suggestions.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">Suggested Actions:</p>
          <ul className="space-y-1">
            {insight.suggestions.map((suggestion, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-center space-x-2">
                <Zap className="w-3 h-3 text-purple-500" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const PredictiveChart = () => (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Predictive Analytics</h3>
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <h4 className="font-medium text-gray-900">Burnout Risk Prediction</h4>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full" style={{ width: '35%' }} />
            </div>
            <span className="text-sm font-medium text-gray-700">35% Risk</span>
          </div>
          <p className="text-xs text-gray-600 mt-2">Based on current workload and completion patterns</p>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-gray-900">Goal Achievement Forecast</h4>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full" style={{ width: '78%' }} />
            </div>
            <span className="text-sm font-medium text-gray-700">78% Likely</span>
          </div>
          <p className="text-xs text-gray-600 mt-2">Projected to meet monthly goals based on current pace</p>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h4 className="font-medium text-gray-900">Deadline Risk Assessment</h4>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">5</div>
              <div className="text-xs text-gray-600">On Track</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">3</div>
              <div className="text-xs text-gray-600">At Risk</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">2</div>
              <div className="text-xs text-gray-600">High Risk</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const BenchmarkComparison = () => (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Industry Benchmarks</h3>
      <div className="space-y-4">
        {[
          { metric: 'Task Completion Rate', your: 78, industry: 65, unit: '%' },
          { metric: 'Average Task Cycle Time', your: 2.3, industry: 3.1, unit: 'days' },
          { metric: 'Time Estimation Accuracy', your: 82, industry: 70, unit: '%' },
          { metric: 'Collaboration Score', your: 91, industry: 75, unit: '/100' },
        ].map((benchmark, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{benchmark.metric}</span>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-bold ${
                  benchmark.your > benchmark.industry ? 'text-green-600' : 'text-red-600'
                }`}>
                  {benchmark.your}{benchmark.unit}
                </span>
                <span className="text-xs text-gray-500">vs {benchmark.industry}{benchmark.unit}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(benchmark.your / Math.max(benchmark.your, benchmark.industry)) * 100}%` }}
                />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-400 h-2 rounded-full" 
                  style={{ width: `${(benchmark.industry / Math.max(benchmark.your, benchmark.industry)) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>You</span>
              <span>Industry Avg</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'insights', label: 'AI Insights', icon: Brain },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp },
    { id: 'benchmarks', label: 'Benchmarks', icon: Target },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl shadow-2xl border border-gray-200/50 w-full max-w-7xl max-h-[90vh] overflow-hidden animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Advanced Analytics</h2>
              <p className="text-sm text-gray-600">AI-powered insights and predictive analytics</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200/50 bg-white/50">
          <div className="flex space-x-1 p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeTab === 'overview' && (
            <>
              {/* Time Range Selector */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
                <div className="flex space-x-2">
                  {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                        timeRange === range
                          ? 'bg-purple-100 text-purple-800'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <MetricCard
                  title="AI Efficiency Score"
                  value={`${analytics.ai?.accuracyRate || 87}/100`}
                  change={12}
                  icon={Brain}
                  color="bg-gradient-to-r from-purple-500 to-pink-500"
                  subtitle="AI suggestions accepted"
                />
                <MetricCard
                  title="Automation Saves"
                  value={`${analytics.ai?.timesSaved || 240}min`}
                  change={18}
                  icon={Zap}
                  color="bg-gradient-to-r from-orange-500 to-red-500"
                  subtitle="Time saved this month"
                />
                <MetricCard
                  title="Quality Score"
                  value={`${analytics.quality?.defectRate || 95}%`}
                  change={-3}
                  icon={Target}
                  color="bg-gradient-to-r from-green-500 to-emerald-500"
                  subtitle="First-time-right rate"
                />
                <MetricCard
                  title="Team Velocity"
                  value={`${analytics.performance?.throughput || 23}/week`}
                  change={8}
                  icon={TrendingUp}
                  color="bg-gradient-to-r from-blue-500 to-indigo-500"
                  subtitle="Tasks completed"
                />
              </div>

              {/* Advanced Charts */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
                  <div className="h-64 flex items-end space-x-2">
                    {trends.map((trend, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-gray-200 rounded-t-lg overflow-hidden" style={{ height: '200px' }}>
                          <div
                            className="w-full bg-gradient-to-t from-purple-500 to-pink-400 rounded-t-lg transition-all duration-500"
                            style={{ height: `${(trend.productivity / 100) * 200}px` }}
                          />
                        </div>
                        <div className="mt-2 text-xs text-gray-600 text-center">
                          {new Date(trend.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Impact Analysis</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Suggestions Generated</span>
                      <span className="text-lg font-bold text-purple-600">{analytics.ai?.suggestionsGenerated || 156}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Suggestions Accepted</span>
                      <span className="text-lg font-bold text-green-600">{analytics.ai?.suggestionsAccepted || 128}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Automation Triggered</span>
                      <span className="text-lg font-bold text-orange-600">{analytics.ai?.automationTriggered || 89}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Insights Provided</span>
                      <span className="text-lg font-bold text-blue-600">{analytics.ai?.insightsProvided || 34}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">AI-Generated Insights</h3>
              <div className="grid grid-cols-1 gap-4">
                {aiInsights.map((insight) => (
                  <AIInsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'predictions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Predictive Analytics</h3>
              <PredictiveChart />
            </div>
          )}

          {activeTab === 'benchmarks' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Performance Benchmarks</h3>
              <BenchmarkComparison />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;