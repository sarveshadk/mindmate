import { motion } from 'motion/react';
import { useState } from 'react';
import { CalendarGrid } from './CalendarGrid';
import type { Task } from '../App';

type CalendarPageProps = {
  tasks: Task[];
  darkMode: boolean;
};

export function CalendarPage({ tasks, darkMode }: CalendarPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const selectedTasks = tasks.filter(task => task.date === selectedDateStr);

  return (
    <motion.div 
      className="w-full max-w-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-3xl mb-8 text-center">Calendar</h2>
      
      <CalendarGrid 
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        darkMode={darkMode}
      />

      {selectedTasks.length > 0 && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <p className={darkMode ? 'text-white/60 mb-4' : 'text-black/60 mb-4'}>
            Tasks for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </p>
          <div className="space-y-3">
            {selectedTasks.map((task) => (
              <motion.div
                key={task.id}
                className={`rounded-2xl px-6 py-4 ${
                  darkMode ? 'bg-white text-black' : 'bg-black text-white'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className={task.completed ? 'line-through opacity-50' : ''}>
                  {task.title}
                </p>
                {task.time && (
                  <p className="text-sm opacity-50 mt-1">{task.time}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}