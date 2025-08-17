import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({ 
  value, 
  onChange, 
  label, 
  placeholder = "Select date", 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value || new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    
    // Start from the previous Sunday
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const currentDateIterator = new Date(startDate);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = currentDateIterator.getMonth() === month;
      const isToday = currentDateIterator.toDateString() === today.toDateString();
      const isSelected = value ? currentDateIterator.toDateString() === value.toDateString() : false;
      
      days.push({
        date: new Date(currentDateIterator),
        isCurrentMonth,
        isToday,
        isSelected,
      });
      
      currentDateIterator.setDate(currentDateIterator.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const handleDateSelect = (date: Date) => {
    onChange(date);
    setIsOpen(false);
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
  };

  const handleMonthChange = (month: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month);
    setCurrentDate(newDate);
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`} ref={containerRef}>
      {label && (
        <label className="px-1 text-xs font-semibold text-gray-700 uppercase tracking-wide">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 text-sm border border-gray-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:border-gray-300 text-left flex items-center justify-between"
        >
          <span className={value ? 'text-gray-900' : 'text-gray-400'}>
            {value ? value.toLocaleDateString() : placeholder}
          </span>
          <Calendar className="w-4 h-4 text-gray-500" />
        </button>
        
        {isOpen && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-auto bg-white rounded-xl shadow-2xl border border-gray-200/50 z-[99999] p-0 overflow-hidden animate-in slide-in-from-bottom-2 duration-300" style={{ zIndex: 99999 }}>
            <div className="p-4">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center space-x-2">
                  {/* Month Dropdown */}
                  <select
                    value={currentDate.getMonth()}
                    onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                    className="px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {monthNames.map((month, index) => (
                      <option key={index} value={index}>{month}</option>
                    ))}
                  </select>
                  
                  {/* Year Dropdown */}
                  <select
                    value={currentDate.getFullYear()}
                    onChange={(e) => handleYearChange(parseInt(e.target.value))}
                    className="px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {generateYears().map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDateSelect(day.date)}
                    className={`
                      p-2 text-sm rounded-lg transition-all duration-200 hover:bg-blue-50
                      ${!day.isCurrentMonth ? 'text-gray-300 hover:text-gray-500' : ''}
                      ${day.isToday ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                      ${day.isSelected && !day.isToday ? 'bg-blue-100 text-blue-800 font-medium' : ''}
                      ${day.isCurrentMonth && !day.isToday && !day.isSelected ? 'text-gray-700 hover:text-blue-600' : ''}
                    `}
                  >
                    {day.date.getDate()}
                  </button>
                ))}
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => handleDateSelect(new Date())}
                  className="px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange(undefined);
                    setIsOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};