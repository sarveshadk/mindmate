import { motion } from 'motion/react';
import type { Task } from '../App';

type ProgressPageProps = {
  tasks: Task[];
  darkMode: boolean;
};

export function ProgressPage({ tasks, darkMode }: ProgressPageProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(task => task.date === today);
  const completedTasks = todayTasks.filter(task => task.completed);
  const progress = todayTasks.length > 0 ? (completedTasks.length / todayTasks.length) * 100 : 0;

  const stats = [
    { label: 'Total Tasks', value: todayTasks.length },
    { label: 'Completed', value: completedTasks.length },
    { label: 'Remaining', value: todayTasks.length - completedTasks.length },
  ];

  return (
    <motion.div 
      className="w-full max-w-2xl text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-3xl mb-8">Progress</h2>

      <motion.div
        className="mb-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke={darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
              strokeWidth="12"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke={darkMode ? 'white' : 'black'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 88}
              initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - progress / 100) }}
              transition={{ duration: 1, ease: 'easeInOut', delay: 0.3 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div>
              <motion.div 
                className="text-5xl mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                {Math.round(progress)}%
              </motion.div>
              <div className={`text-sm ${darkMode ? 'text-white/60' : 'text-black/60'}`}>Complete</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className={`rounded-2xl px-6 py-8 ${
              darkMode ? 'bg-white/10' : 'bg-black/10'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
          >
            <div className="text-4xl mb-2">{stat.value}</div>
            <div className={`text-sm ${darkMode ? 'text-white/60' : 'text-black/60'}`}>{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}