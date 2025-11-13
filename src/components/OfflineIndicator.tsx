import { motion, AnimatePresence } from 'motion/react';
import { WifiOff } from 'lucide-react';
import { useState, useEffect } from 'react';

type OfflineIndicatorProps = {
  darkMode: boolean;
};

export function OfflineIndicator({ darkMode }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full flex items-center gap-3 z-50 shadow-lg ${
            darkMode ? 'bg-white text-black' : 'bg-black text-white'
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <WifiOff className="w-5 h-5" />
          </motion.div>
          <span>Offline Mode</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}