import { motion } from 'motion/react';
import { Mic, X } from 'lucide-react';
import { useState } from 'react';
import type { Task } from '../App';

type VoiceAssistantProps = {
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onClose: () => void;
  darkMode: boolean;
};

export function VoiceAssistant({ onAddTask, onClose, darkMode }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleStartListening = () => {
    setIsListening(true);
    setTranscript('Listening...');
    
    // Simulate voice recognition after 2 seconds
    setTimeout(() => {
      const exampleCommands = [
        'Add task: Review presentation at 3 PM',
        'Add task: Call client tomorrow',
        'Add task: Finish documentation',
      ];
      const randomCommand = exampleCommands[Math.floor(Math.random() * exampleCommands.length)];
      setTranscript(randomCommand);
      
      // Parse the command
      setTimeout(() => {
        const taskMatch = randomCommand.match(/Add task: (.+?)(?:\s+at\s+(.+))?$/);
        if (taskMatch) {
          const today = new Date().toISOString().split('T')[0];
          onAddTask({
            title: taskMatch[1],
            time: taskMatch[2] || undefined,
            completed: false,
            date: today,
          });
          setTranscript('Task added!');
          setTimeout(() => {
            onClose();
          }, 1000);
        }
        setIsListening(false);
      }, 1500);
    }, 2000);
  };

  return (
    <motion.div 
      className="w-full max-w-2xl text-center flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.button
        onClick={onClose}
        className={`self-end mb-8 p-2 rounded-full transition-colors ${
          darkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <X className="w-6 h-6" />
      </motion.button>

      <h2 className="text-3xl mb-8">Voice Assistant</h2>

      <motion.div
        className="relative mb-12"
        animate={isListening ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={{
          duration: 1.5,
          repeat: isListening ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        <motion.button
          onClick={handleStartListening}
          disabled={isListening}
          className={`w-32 h-32 rounded-full flex items-center justify-center relative ${
            darkMode ? 'bg-white text-black' : 'bg-black text-white'
          }`}
          whileHover={!isListening ? { scale: 1.05 } : {}}
          whileTap={!isListening ? { scale: 0.95 } : {}}
        >
          <Mic className="w-16 h-16" />
        </motion.button>

        {isListening && (
          <motion.div
            className={`absolute inset-0 rounded-full border-2 ${
              darkMode ? 'border-white' : 'border-black'
            }`}
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{
              scale: [1, 1.5, 1.8],
              opacity: [0.8, 0.4, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}
      </motion.div>

      {transcript && (
        <motion.div
          className={`rounded-2xl px-8 py-6 max-w-md ${
            darkMode ? 'bg-white text-black' : 'bg-black text-white'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p>{transcript}</p>
        </motion.div>
      )}

      {isListening && (
        <motion.div
          className="flex gap-2 items-end justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className={`w-1 rounded-full ${darkMode ? 'bg-white' : 'bg-black'}`}
              animate={{
                height: ['16px', '32px', '16px'],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>
      )}

      {!isListening && !transcript && (
        <motion.p
          className={darkMode ? 'text-white/60 mt-8' : 'text-black/60 mt-8'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          Tap the microphone to start
        </motion.p>
      )}
    </motion.div>
  );
}