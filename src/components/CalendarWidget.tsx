import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from './ui/button';

export function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);
    const today = new Date();

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const isToday = 
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

      days.push(
        <div
          key={day}
          className={`p-2 text-center text-sm border cursor-pointer hover:bg-gray-100 ${
            isToday ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-white'
          }`}
          style={isToday ? { backgroundColor: '#F26522', color: 'white' } : {}}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="border-2 bg-white" style={{ borderColor: '#E8F4F8' }}>
      {/* Header */}
      <div className="px-3 py-2 flex items-center justify-between" style={{ backgroundColor: '#003B5C' }}>
        <Calendar className="h-4 w-4 text-white" />
        <h3 className="text-sm text-white">Calendar</h3>
        <div className="w-4"></div>
      </div>

      {/* Month Navigation */}
      <div className="px-3 py-2 flex items-center justify-between bg-gray-50 border-b-2" style={{ borderBottomColor: '#E8F4F8' }}>
        <button
          onClick={previousMonth}
          className="p-1 hover:bg-gray-200"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" style={{ color: '#003B5C' }} />
        </button>
        <span className="text-sm" style={{ color: '#003B5C' }}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-gray-200"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" style={{ color: '#003B5C' }} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-2">
        {/* Day names */}
        <div className="grid grid-cols-7 mb-1">
          {dayNames.map((day) => (
            <div key={day} className="p-1 text-center text-xs" style={{ color: '#003B5C' }}>
              {day}
            </div>
          ))}
        </div>
        
        {/* Days */}
        <div className="grid grid-cols-7 gap-0.5">
          {renderCalendar()}
        </div>
      </div>

      {/* Today's Date */}
      <div className="px-3 py-2 bg-gray-50 border-t-2 text-sm text-center" style={{ borderTopColor: '#E8F4F8' }}>
        <span className="text-muted-foreground">Today: </span>
        <span style={{ color: '#003B5C' }}>{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
}
