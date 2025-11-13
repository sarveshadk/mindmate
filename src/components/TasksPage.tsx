import { motion, AnimatePresence } from 'motion/react';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import type { Task } from '../App';

type TasksPageProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (task: Omit<Task, 'id'>) => void;
  darkMode: boolean;
};

export function TasksPage({ tasks, onToggle, onDelete, onAdd, darkMode }: TasksPageProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(task => task.date === today);
  const completedCount = todayTasks.filter(t => t.completed).length;

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAdd({
        title: newTaskTitle,
        time: newTaskTime || undefined,
        completed: false,
        date: today,
      });
      setNewTaskTitle('');
      setNewTaskTime('');
      setShowAddForm(false);
    }
  };

  return (
    <motion.div 
      className="w-full max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl mb-2">Tasks</h2>
        <p className={darkMode ? 'text-white/60' : 'text-black/60'}>
          {completedCount} of {todayTasks.length} tasks completed
        </p>
      </div>

      <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {todayTasks.map((task) => (
            <motion.div
              key={task.id}
              className={`rounded-2xl px-6 py-4 flex items-center gap-4 ${
                darkMode ? 'bg-white text-black' : 'bg-black text-white'
              }`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, x: -100 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <motion.button
                onClick={() => onToggle(task.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  task.completed 
                    ? darkMode ? 'bg-black border-black' : 'bg-white border-white'
                    : darkMode ? 'border-black/30' : 'border-white/30'
                }`}
                whileTap={{ scale: 0.9 }}
              >
                {task.completed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <svg className={`w-4 h-4 ${darkMode ? 'text-white' : 'text-black'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
              
              <div className="flex-1">
                <p className={task.completed ? 'line-through opacity-50' : ''}>
                  {task.title}
                </p>
                {task.time && (
                  <p className="text-sm opacity-50 mt-1">{task.time}</p>
                )}
              </div>
              
              <motion.button
                onClick={() => onDelete(task.id)}
                className={`p-2 rounded-full transition-colors ${
                  darkMode ? 'hover:bg-black/5' : 'hover:bg-white/20'
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showAddForm ? (
          <motion.div
            className={`rounded-2xl p-6 ${
              darkMode ? 'bg-white text-black' : 'bg-black text-white'
            }`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <input
              type="text"
              placeholder="Task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl mb-3 outline-none ${
                darkMode ? 'bg-black/5' : 'bg-white/10 placeholder:text-white/50'
              }`}
              autoFocus
            />
            <input
              type="text"
              placeholder="Time (optional)"
              value={newTaskTime}
              onChange={(e) => setNewTaskTime(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl mb-4 outline-none ${
                darkMode ? 'bg-black/5' : 'bg-white/10 placeholder:text-white/50'
              }`}
            />
            <div className="flex gap-3">
              <motion.button
                onClick={handleAddTask}
                className={`flex-1 py-3 rounded-xl ${
                  darkMode ? 'bg-black text-white' : 'bg-white text-black'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                Add Task
              </motion.button>
              <motion.button
                onClick={() => setShowAddForm(false)}
                className={`px-6 py-3 rounded-xl ${
                  darkMode ? 'bg-black/5' : 'bg-white/10'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            onClick={() => setShowAddForm(true)}
            className={`fixed bottom-24 right-8 w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
              darkMode ? 'bg-white text-black' : 'bg-black text-white'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Plus className="w-8 h-8" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}