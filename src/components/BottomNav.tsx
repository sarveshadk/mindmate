import { motion } from 'motion/react';
import { Home, CheckSquare, Calendar, TrendingUp, Mic } from 'lucide-react';

type BottomNavProps = {
  currentPage: 'home' | 'tasks' | 'calendar' | 'progress' | 'voice';
  onNavigate: (page: 'home' | 'tasks' | 'calendar' | 'progress' | 'voice') => void;
  darkMode: boolean;
};

export function BottomNav({ currentPage, onNavigate, darkMode }: BottomNavProps) {
  const navItems = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'tasks' as const, icon: CheckSquare, label: 'Tasks' },
    { id: 'calendar' as const, icon: Calendar, label: 'Calendar' },
    { id: 'progress' as const, icon: TrendingUp, label: 'Progress' },
  ];

  return (
    <motion.nav 
      className="px-8 pb-6 pt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className={`backdrop-blur-sm rounded-full px-6 py-4 flex items-center justify-between ${
        darkMode ? 'bg-black/80 border-white/10' : 'bg-white/80 border-black/10'
      } border`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="relative p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon 
                className={`w-6 h-6 transition-opacity duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-40'
                }`} 
              />
              {isActive && (
                <motion.div
                  className={darkMode ? 'bg-white/10' : 'bg-black/10'}
                  style={{ position: 'absolute', inset: 0, borderRadius: '9999px' }}
                  layoutId="activeNav"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
        
        <motion.button
          onClick={() => onNavigate('voice')}
          className={`relative p-3 rounded-full ml-2 ${
            darkMode ? 'bg-white text-black' : 'bg-black text-white'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={currentPage === 'voice' ? {
            boxShadow: darkMode 
              ? [
                  '0 0 0 0 rgba(255, 255, 255, 0.4)',
                  '0 0 0 8px rgba(255, 255, 255, 0)',
                  '0 0 0 0 rgba(255, 255, 255, 0)',
                ]
              : [
                  '0 0 0 0 rgba(0, 0, 0, 0.4)',
                  '0 0 0 8px rgba(0, 0, 0, 0)',
                  '0 0 0 0 rgba(0, 0, 0, 0)',
                ],
          } : {}}
          transition={{
            duration: 2,
            repeat: currentPage === 'voice' ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          <Mic className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.nav>
  );
}