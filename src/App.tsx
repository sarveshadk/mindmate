import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './components/HomePage';
import { TasksPage } from './components/TasksPage';
import { CalendarPage } from './components/CalendarPage';
import { ProgressPage } from './components/ProgressPage';
import { VoiceAssistant } from './components/VoiceAssistant';
import { SplashScreen } from './components/SplashScreen';
import { OfflineIndicator } from './components/OfflineIndicator';

export type Task = {
  id: string;
  title: string;
  time?: string;
  completed: boolean;
  date: string;
};

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'tasks' | 'calendar' | 'progress' | 'voice'>('home');
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('mindmate-tasks');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: '1', title: 'Finish report', time: '10:00 AM', completed: false, date: new Date().toISOString().split('T')[0] },
      { id: '2', title: 'Team meeting', time: '2:00 PM', completed: false, date: new Date().toISOString().split('T')[0] },
      { id: '3', title: 'Review designs', time: '4:30 PM', completed: false, date: new Date().toISOString().split('T')[0] },
    ];
  });
  const [focusMode, setFocusMode] = useState(() => {
    const saved = localStorage.getItem('mindmate-focus-mode');
    return saved ? JSON.parse(saved) : true;
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('mindmate-dark-mode');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('mindmate-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('mindmate-focus-mode', JSON.stringify(focusMode));
  }, [focusMode]);

  useEffect(() => {
    localStorage.setItem('mindmate-dark-mode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && currentPage === 'voice') {
        setCurrentPage('home');
      }
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            setCurrentPage('home');
            break;
          case '2':
            e.preventDefault();
            setCurrentPage('tasks');
            break;
          case '3':
            e.preventDefault();
            setCurrentPage('calendar');
            break;
          case '4':
            e.preventDefault();
            setCurrentPage('progress');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage]);

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: Date.now().toString() };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage tasks={tasks} darkMode={darkMode} />;
      case 'tasks':
        return <TasksPage tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} onAdd={addTask} darkMode={darkMode} />;
      case 'calendar':
        return <CalendarPage tasks={tasks} darkMode={darkMode} />;
      case 'progress':
        return <ProgressPage tasks={tasks} darkMode={darkMode} />;
      case 'voice':
        return <VoiceAssistant onAddTask={addTask} onClose={() => setCurrentPage('home')} darkMode={darkMode} />;
      default:
        return <HomePage tasks={tasks} darkMode={darkMode} />;
    }
  };

  return (
    <div className={`fixed inset-0 overflow-hidden flex flex-col transition-colors duration-300 ${
      darkMode ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      {showSplash && <SplashScreen />}
      <OfflineIndicator darkMode={darkMode} />
      
      <Header 
        focusMode={focusMode} 
        onToggleFocus={() => setFocusMode(!focusMode)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
      
      <main className="flex-1 flex items-center justify-center px-8 py-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full h-full flex items-center justify-center"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} darkMode={darkMode} />
    </div>
  );
}

export default App;