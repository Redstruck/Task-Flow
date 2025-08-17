import React, { useState, useMemo } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  isToday, 
  addMonths, 
  subMonths,
  setHours,
  setMinutes
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Trash2, X } from 'lucide-react';
import { CalendarEvent, TodoList } from '../types';

interface EventCalendarProps {
  events: CalendarEvent[];
  lists: TodoList[];
  onEventAdd: (event: CalendarEvent) => void;
  onEventUpdate: (event: CalendarEvent) => void;
  onEventDelete: (eventId: string) => void;
  onTaskCreate?: (listId: string, title: string, dueDate?: Date) => void;
}

interface EventFormData {
  title: string;
  description: string;
  start: Date;
  end: Date;
  allDay: boolean;
  color: CalendarEvent['color'];
  listId: string;
  createTask: boolean;
}

const colorClasses = {
  sky: {
    bg: 'bg-sky-100 hover:bg-sky-200',
    border: 'border-sky-300',
    text: 'text-sky-800',
    dot: 'bg-sky-500'
  },
  emerald: {
    bg: 'bg-emerald-100 hover:bg-emerald-200',
    border: 'border-emerald-300',
    text: 'text-emerald-800',
    dot: 'bg-emerald-500'
  },
  amber: {
    bg: 'bg-amber-100 hover:bg-amber-200',
    border: 'border-amber-300',
    text: 'text-amber-800',
    dot: 'bg-amber-500'
  },
  orange: {
    bg: 'bg-orange-100 hover:bg-orange-200',
    border: 'border-orange-300',
    text: 'text-orange-800',
    dot: 'bg-orange-500'
  },
  rose: {
    bg: 'bg-rose-100 hover:bg-rose-200',
    border: 'border-rose-300',
    text: 'text-rose-800',
    dot: 'bg-rose-500'
  },
  violet: {
    bg: 'bg-violet-100 hover:bg-violet-200',
    border: 'border-violet-300',
    text: 'text-violet-800',
    dot: 'bg-violet-500'
  },
  indigo: {
    bg: 'bg-indigo-100 hover:bg-indigo-200',
    border: 'border-indigo-300',
    text: 'text-indigo-800',
    dot: 'bg-indigo-500'
  }
};

const EventCalendar: React.FC<EventCalendarProps> = ({
  events,
  lists,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  onTaskCreate
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [taskCreated, setTaskCreated] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(),
    allDay: false,
    color: 'sky',
    listId: lists.length > 0 ? lists[0].id : '',
    createTask: true
  });

  // Helper function to get list name by ID
  const getListName = (listId: string | undefined): string => {
    if (!listId) return 'No List';
    const list = lists.find(l => l.id === listId);
    return list ? list.title : 'Unknown List';
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = useMemo(() => {
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }, [startDate, endDate]);

  const getDayEvents = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.start), date));
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handleDateClick = (date: Date) => {
    if (!lists.length) return;
    
    setEditingEvent(null);
    setTaskCreated(null);
    setFormData({
      title: '',
      description: '',
      start: setHours(setMinutes(date, 0), 9),
      end: setHours(setMinutes(date, 0), 10),
      allDay: false,
      color: 'sky',
      listId: lists.length > 0 ? lists[0].id : '',
      createTask: true
    });
    setShowEventModal(true);
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if this is a task-based event (read-only)
    if (event.id.startsWith('task-')) {
      // Show a read-only view or just prevent editing
      console.log('Task-based event clicked (read-only):', event);
      return;
    }
    
    setEditingEvent(event);
    setTaskCreated(null);
    setFormData({
      title: event.title,
      description: event.description || '',
      start: new Date(event.start),
      end: new Date(event.end),
      allDay: event.allDay || false,
      color: event.color,
      listId: event.listId || (lists.length > 0 ? lists[0].id : ''),
      createTask: false
    });
    setShowEventModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    const eventData: CalendarEvent = {
      id: editingEvent?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      start: formData.start,
      end: formData.end,
      color: formData.color,
      listId: formData.listId
    };

    if (editingEvent) {
      onEventUpdate(eventData);
      console.log('📝 Updated event:', eventData);
    } else {
      onEventAdd(eventData);
      console.log('➕ Created new event:', eventData);
      
      // Create task if checkbox is checked and we're creating a new event
      if (formData.createTask && onTaskCreate && formData.listId) {
        const listName = getListName(formData.listId);
        onTaskCreate(formData.listId, formData.title, formData.start);
        setTaskCreated(`Task created in "${listName}"!`);
        console.log('✅ Task created from calendar event');
        
        // Show browser notification
        if (Notification.permission === 'granted') {
          new Notification('Task Created!', {
            body: `Task "${formData.title}" added to ${listName}`,
            icon: '/favicon.ico'
          });
        }
      }
    }

    setShowEventModal(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = () => {
    if (editingEvent) {
      onEventDelete(editingEvent.id);
      setShowEventModal(false);
      setEditingEvent(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => {
            if (!lists.length) return;
            setEditingEvent(null);
            setTaskCreated(null);
            setFormData({
              title: '',
              description: '',
              start: setHours(setMinutes(new Date(), 0), 9),
              end: setHours(setMinutes(new Date(), 0), 10),
              allDay: false,
              color: 'sky',
              listId: lists.length > 0 ? lists[0].id : '',
              createTask: true
            });
            setShowEventModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const dayEvents = getDayEvents(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={index}
                onClick={() => handleDateClick(day)}
                className={`min-h-[100px] p-2 border border-gray-200 rounded-lg cursor-pointer transition-colors ${
                  isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'
                } ${isCurrentDay ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className={`text-sm font-medium ${isCurrentDay ? 'text-blue-600' : ''}`}>
                  {format(day, 'd')}
                </div>
                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 2).map((event) => {
                    const colorClass = colorClasses[event.color] || colorClasses.sky;
                    const isTaskEvent = event.id.startsWith('task-');
                    return (
                      <div
                        key={event.id}
                        onClick={(e) => handleEventClick(event, e)}
                        className={`text-xs p-1 rounded truncate ${colorClass.bg} ${colorClass.text} hover:${colorClass.border} ${
                          isTaskEvent ? 'border-l-2 border-gray-600' : 'cursor-pointer'
                        }`}
                        title={`${event.title}${isTaskEvent ? ' (Task - Read Only)' : ''}`}
                      >
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${colorClass.dot} flex-shrink-0`} />
                          <span className="truncate">{event.title}</span>
                        </div>
                        {event.listId && (
                          <div className="text-xs opacity-75 mt-1">
                            📋 {getListName(event.listId)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingEvent ? 'Edit Event' : 'Add Event'}
              </h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {lists.length === 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    No task lists available. Please create a task list first to associate events with them.
                  </p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter event title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter event description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {Object.entries(colorClasses).map(([color, classes]) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color: color as CalendarEvent['color'] }))}
                      className={`w-8 h-8 rounded-full ${classes.dot} ${
                        formData.color === color ? 'ring-2 ring-gray-400 ring-offset-2' : ''
                      } hover:scale-110 transition-transform`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task List
                </label>
                <select
                  value={formData.listId}
                  onChange={(e) => setFormData(prev => ({ ...prev, listId: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {lists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.title}
                    </option>
                  ))}
                </select>
              </div>

              {!editingEvent && onTaskCreate && lists.length > 0 && (
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="createTask"
                    checked={formData.createTask}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, createTask: e.target.checked }));
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="createTask" className="text-sm font-medium text-gray-700">
                    Also create a task in the selected list
                  </label>
                </div>
              )}

              {taskCreated && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">✅ {taskCreated}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                {editingEvent && (
                  <button
                    type="button"
                    onClick={handleDeleteEvent}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                )}
                <div className="flex space-x-3 ml-auto">
                  <button
                    type="button"
                    onClick={() => setShowEventModal(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingEvent ? 'Update Event' : 'Add Event'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
