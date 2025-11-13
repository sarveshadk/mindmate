import { motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';

type HeaderProps = {
  focusMode: boolean;
  onToggleFocus: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
};

export function Header({ focusMode, onToggleFocus, darkMode, onToggleDarkMode }: HeaderProps) {
  const now = new Date();
  const hours = now.getHours();
  const greeting = hours < 12 ? 'Good Morning' : hours < 18 ? 'Good Afternoon' : 'Good Evening';
  
  const date = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <header className="px-8 py-6 flex items-start justify-between">
      <div>
        <motion.h1 
          className="mb-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          MindMate
        </motion.h1>
        <motion.p 
          className={darkMode ? 'text-white/60' : 'text-black/60'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {greeting}, Sarvesh
        </motion.p>
        <motion.p 
          className={`text-sm mt-1 ${darkMode ? 'text-white/40' : 'text-black/40'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {date}
        </motion.p>
      </div>
      
      <div className="flex gap-3">
        <motion.button
          className={`p-3 rounded-full transition-colors ${
            darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'
          }`}
          onClick={onToggleDarkMode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
        
        <motion.button
          className={`px-4 py-2 rounded-full text-sm ${
            darkMode ? 'bg-white text-black' : 'bg-black text-white'
          }`}
          onClick={onToggleFocus}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          Focus Mode: {focusMode ? 'ON' : 'OFF'}
        </motion.button>
      </div>
    </header>
  );
}