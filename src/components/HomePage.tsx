import { motion } from 'motion/react';
import { Clock } from './Clock';
import { CalendarGrid } from './CalendarGrid';
import type { Task } from '../App';

type HomePageProps = {
  tasks: Task[];
  darkMode: boolean;
};

export function HomePage({ tasks, darkMode }: HomePageProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(task => task.date === today && !task.completed);
  const nextTask = todayTasks[0];

  return (
    <motion.div 
      className="w-full max-w-4xl flex flex-col items-center gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Clock />
      
      {nextTask && (
        <motion.div
          className={`rounded-3xl px-8 py-6 max-w-md w-full text-center ${
            darkMode ? 'bg-white text-black' : 'bg-black text-white'
          }`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <p className="text-sm opacity-60 mb-2">Next up</p>
          <p className="text-lg mb-1">{nextTask.title}</p>
          {nextTask.time && (
            <p className="text-sm opacity-60">{nextTask.time}</p>
          )}
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <CalendarGrid compact selectedDate={new Date()} darkMode={darkMode} />
      </motion.div>
    </motion.div>
  );
}