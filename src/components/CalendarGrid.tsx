import { motion } from 'motion/react';
import { useState } from 'react';

type CalendarGridProps = {
  onSelectDate?: (date: Date) => void;
  selectedDate?: Date;
  compact?: boolean;
  darkMode: boolean;
};

export function CalendarGrid({ onSelectDate, selectedDate, compact = false, darkMode }: CalendarGridProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const today = new Date();
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className={compact ? 'w-full max-w-md' : 'w-full max-w-2xl'}>
      {!compact && (
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className={`px-4 py-2 rounded-full transition-colors ${
              darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            ←
          </motion.button>
          <h2 className="text-xl">{monthName}</h2>
          <motion.button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className={`px-4 py-2 rounded-full transition-colors ${
              darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            →
          </motion.button>
        </div>
      )}

      <div className={`grid grid-cols-7 gap-2 ${compact ? 'gap-1' : 'gap-2'}`}>
        {days.map((day) => (
          <div key={day} className={`text-center ${compact ? 'text-xs py-1' : 'py-2'} ${
            darkMode ? 'text-white/40' : 'text-black/40'
          }`}>
            {compact ? day.slice(0, 1) : day}
          </div>
        ))}
        
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}
        
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const selected = isSelected(day);
          const today = isToday(day);
          
          return (
            <motion.button
              key={day}
              onClick={() => {
                const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                onSelectDate?.(newDate);
              }}
              className={`
                ${compact ? 'aspect-square text-sm p-1' : 'aspect-square p-3'} 
                rounded-full relative transition-colors
                ${selected 
                  ? darkMode ? 'bg-white text-black' : 'bg-black text-white'
                  : darkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'
                }
                ${today && !selected 
                  ? darkMode ? 'ring-1 ring-white/40' : 'ring-1 ring-black/40'
                  : ''
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {day}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}