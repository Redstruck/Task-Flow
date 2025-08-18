import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, Clock, User, FileText } from 'lucide-react';
import { Task, TodoList } from '../types';

interface CalendarViewProps {
  lists: TodoList[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (listId: string, taskId: string, updates: Partial<Task>) => void;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: (Task & { listId: string; listTitle: string; listColor: string })[];
}

interface TaskWithList extends Task {
  listId: string;
  listTitle: string;
  listColor: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  lists,
  isOpen,
  onClose,
  onUpdateTask,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // Get all tasks with their list information
  const allTasksWithList = useMemo(() => {
    const tasks: TaskWithList[] = [];
    lists.forEach(list => {
      list.tasks.forEach(task => {
        if (task.dueDate) {
          tasks.push({
            ...task,
            listId: list.id,
            listTitle: list.title,
            listColor: list.color,
          });
        }
      });
    });
    return tasks;
  }, [lists]);

  // Generate calendar days for the current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayTasks = allTasksWithList.filter(task => {
        const taskDate = new Date(task.dueDate!);
        return taskDate.toDateString() === date.toDateString();
      });

      days.push({
        date: new Date(date),
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
        tasks: dayTasks,
      });
    }

    return days;
  }, [currentDate, allTasksWithList]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const getTasksByDate = (date: Date) => {
    return allTasksWithList.filter(task => {
      const taskDate = new Date(task.dueDate!);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const selectedDateTasks = selectedDate ? getTasksByDate(selectedDate) : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-7xl max-h-[90vh] overflow-hidden animate-in slide-in-from-top-2 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Calendar View</h2>
              <p className="text-sm text-gray-600">Monthly overview of all your tasks</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left side - Calendar */}
          <div className="flex-1 p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <h3 className="text-xl font-bold text-gray-900">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
              >
                Today
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-0 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
              {calendarDays.map((day, index) => {
                const isSelected = selectedDate?.toDateString() === day.date.toDateString();
                
                return (
                  <div
                    key={index}
                    className={`relative h-16 border-r border-b border-gray-200 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                      day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                    } ${day.isToday ? 'bg-blue-600 text-white' : ''} ${
                      isSelected ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => setSelectedDate(day.date)}
                    onMouseEnter={() => setHoveredDate(day.date)}
                    onMouseLeave={() => setHoveredDate(null)}
                  >
                    <div className={`p-2 text-sm font-medium ${
                      day.isCurrentMonth ? (day.isToday ? 'text-white' : 'text-gray-900') : 'text-gray-400'
                    }`}>
                      {day.date.getDate()}
                    </div>
                    
                    {/* Task indicators */}
                    {day.tasks.length > 0 && (
                      <div className="absolute bottom-1 left-1 right-1">
                        {day.tasks.length === 1 ? (
                          <div className={`w-full h-1 rounded-full ${
                            day.tasks[0].completed ? 'bg-green-400' : 
                            day.tasks[0].priority === 'high' ? 'bg-red-400' :
                            day.tasks[0].priority === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                          }`} />
                        ) : day.tasks.length <= 4 ? (
                          <div className="flex space-x-0.5">
                            {day.tasks.slice(0, 4).map((task, i) => (
                              <div
                                key={i}
                                className={`flex-1 h-1 rounded-full ${
                                  task.completed ? 'bg-green-400' :
                                  task.priority === 'high' ? 'bg-red-400' :
                                  task.priority === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                                }`}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {day.tasks.length}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right sidebar - Selected Date Info */}
          <div className="w-80 border-l border-gray-200 bg-gray-50">
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  {selectedDate ? selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  }) : 'Select a date'}
                </h4>
                <p className="text-sm text-gray-600">
                  {selectedDate ? `${selectedDateTasks.length} tasks due` : 'Click on a date to see tasks'}
                </p>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[calc(90vh-250px)]">
                {selectedDate ? (
                  selectedDateTasks.length > 0 ? (
                    selectedDateTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h5 className={`font-medium text-gray-900 mb-1 ${
                              task.completed ? 'line-through text-gray-500' : ''
                            }`}>
                              {task.title}
                            </h5>
                            <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${task.listColor}-100 text-${task.listColor}-800`}>
                                {task.listTitle}
                              </span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => onUpdateTask(task.listId, task.id, { completed: !task.completed })}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                              task.completed
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300 hover:border-green-400'
                            }`}
                          >
                            {task.completed && <span className="text-xs">✓</span>}
                          </button>
                        </div>

                        {task.description && (
                          <p className={`text-sm text-gray-600 mb-3 ${
                            task.completed ? 'line-through' : ''
                          }`}>
                            {task.description}
                          </p>
                        )}

                        <div className="space-y-2">
                          {task.dueDate && (
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>Due: {new Date(task.dueDate).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit' 
                              })}</span>
                            </div>
                          )}
                          
                          {task.assignee && (
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <User className="w-3 h-3" />
                              <span>Assigned to: {task.assignee}</span>
                            </div>
                          )}
                          
                          {task.attachments && task.attachments.length > 0 && (
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <FileText className="w-3 h-3" />
                              <span>{task.attachments.length} attachment{task.attachments.length !== 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No tasks due on this date</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Select a date to view tasks</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;