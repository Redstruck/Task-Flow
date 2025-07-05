import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Clock, Target, Users, Calendar, X, Download, Filter } from 'lucide-react';
import { TodoList, AnalyticsData, Task } from '../types';
import { getAnalyticsData, getProductivityTrends } from '../utils/analyticsUtils';

interface AnalyticsProps {
  lists: TodoList[];
  isOpen: boolean;
  onClose: () => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ lists, isOpen, onClose }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedMetric, setSelectedMetric] = useState<'productivity' | 'time' | 'completion' | 'collaboration'>('productivity');

  const analytics = useMemo(() => getAnalyticsData(lists, timeRange), [lists, timeRange]);
  const trends = useMemo(() => getProductivityTrends(lists, timeRange), [lists, timeRange]);

  if (!isOpen) return null;

  const MetricCard = ({ title, value, change, icon: Icon, color }: {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ElementType;
    color: string;
  }) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
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
    </div>
  );

  const ProductivityChart = () => (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Productivity Trends</h3>
        <div className="flex space-x-2">
          {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                timeRange === range
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-64 flex items-end space-x-2">
        {trends.map((trend, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-gray-200 rounded-t-lg overflow-hidden" style={{ height: '200px' }}>
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500"
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
  );

  const TimeDistribution = () => {
    const totalTime = Object.values(analytics.timeTracking.timeByPriority).reduce((sum, time) => sum + time, 0);
    
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Time Distribution by Priority</h3>
        <div className="space-y-4">
          {Object.entries(analytics.timeTracking.timeByPriority).map(([priority, time]) => {
            const percentage = totalTime > 0 ? (time / totalTime) * 100 : 0;
            const color = priority === 'high' ? 'bg-red-500' : 
                         priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500';
            
            return (
              <div key={priority} className="flex items-center space-x-3">
                <div className="w-16 text-sm font-medium text-gray-700 capitalize">
                  {priority}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${color} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-16 text-sm text-gray-600 text-right">
                  {Math.round(time)}h
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const CompletionStats = () => (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Completion Analysis</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {analytics.completion.completionRate}%
          </div>
          <div className="text-sm text-gray-600">Completion Rate</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {analytics.completion.onTimeCompletion}%
          </div>
          <div className="text-sm text-gray-600">On-Time Completion</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {analytics.completion.averageTaskAge}d
          </div>
          <div className="text-sm text-gray-600">Avg Task Age</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {analytics.timeTracking.estimationAccuracy}%
          </div>
          <div className="text-sm text-gray-600">Time Accuracy</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl shadow-2xl border border-gray-200/50 w-full max-w-7xl max-h-[90vh] overflow-hidden animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
              <p className="text-sm text-gray-600">Insights into your productivity and performance</p>
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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Tasks Completed"
              value={analytics.productivity.tasksCompleted}
              change={12}
              icon={Target}
              color="bg-gradient-to-r from-green-500 to-emerald-500"
            />
            <MetricCard
              title="Focus Time"
              value={`${Math.round(analytics.productivity.focusTime)}h`}
              change={8}
              icon={Clock}
              color="bg-gradient-to-r from-blue-500 to-indigo-500"
            />
            <MetricCard
              title="Productivity Score"
              value={`${analytics.productivity.productivityScore}/100`}
              change={-3}
              icon={TrendingUp}
              color="bg-gradient-to-r from-purple-500 to-pink-500"
            />
            <MetricCard
              title="Team Members"
              value={analytics.collaboration.collaborators}
              change={25}
              icon={Users}
              color="bg-gradient-to-r from-orange-500 to-red-500"
            />
          </div>

          {/* Charts and Analysis */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <ProductivityChart />
            <TimeDistribution />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <CompletionStats />
          </div>

          {/* Peak Performance Hours */}
          <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Performance Hours</h3>
            <div className="flex items-center space-x-2">
              {analytics.productivity.peakHours.map((hour, index) => (
                <div
                  key={index}
                  className="px-3 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-lg text-sm font-medium"
                >
                  {hour}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              You're most productive during these hours. Consider scheduling important tasks during these times.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;