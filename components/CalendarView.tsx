import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Entry } from '../types';

interface CalendarViewProps {
  entries: Entry[];
  onDateClick: (date: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ entries, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const entryDates = new Set(entries.map(e => e.date));
  
  const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];

  const changeMonth = (amount: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cells = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const hasEntry = entryDates.has(dateString);
      const isToday = date.getTime() === today.getTime();

      cells.push(
        <div 
          key={day} 
          className={`flex items-center justify-center p-2 border border-transparent rounded-lg cursor-pointer transition-colors relative ${isToday ? 'bg-rose-100' : 'hover:bg-amber-100'}`}
          onClick={() => onDateClick(dateString)}
        >
          <span className={`flex items-center justify-center w-8 h-8 rounded-full ${isToday ? 'font-bold text-rose-600' : 'text-gray-700'}`}>
            {day}
          </span>
          {hasEntry && (
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
          )}
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeft /></button>
        <h2 className="text-xl font-bold text-gray-800">
          {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
        </h2>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronRight /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {renderCalendar()}
      </div>
       <div className="text-center mt-6 text-sm text-gray-500">
          <p>日付をクリックして日記を作成・編集します。</p>
          <p>日記がある日には <span className="inline-block w-1.5 h-1.5 bg-rose-500 rounded-full align-middle mx-1"></span> が表示されます。</p>
        </div>
    </div>
  );
};

export default CalendarView;
