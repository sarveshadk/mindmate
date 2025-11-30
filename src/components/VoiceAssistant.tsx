import { motion } from 'framer-motion';
import { Mic, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { Task } from '../App';

type VoiceAssistantProps = {
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onClose: () => void;
  darkMode: boolean;
};

export function VoiceAssistant({ onAddTask, onClose, darkMode }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef<string>('');
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setInterimText('Listening...');
      setError('');
      finalTranscriptRef.current = '';
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        
        if (result.isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      if (interim) {
        setInterimText(interim);
      }

      if (final.trim()) {
        finalTranscriptRef.current += final;
        const fullTranscript = finalTranscriptRef.current.trim();
        
        // Clear previous timeout
        if (processingTimeoutRef.current) {
          clearTimeout(processingTimeoutRef.current);
        }
        
        // Process command after brief pause (user finished speaking)
        processingTimeoutRef.current = setTimeout(() => {
          if (fullTranscript.length > 0) {
            processCommand(fullTranscript);
          }
        }, 1200);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      switch (event.error) {
        case 'no-speech':
          setError('No speech detected. Please speak clearly.');
          break;
        case 'audio-capture':
          setError('Microphone not found. Please check your microphone.');
          break;
        case 'not-allowed':
          setError('Microphone access denied. Please allow microphone access in browser settings.');
          break;
        case 'network':
          setError('Network error. Please check your internet connection.');
          break;
        case 'aborted':
          // Don't show error for aborted, it's intentional
          break;
        default:
          setError(`Error: ${event.error}. Please try again.`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText('');
    };

    recognitionRef.current = recognition;

    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  const processCommand = (command: string) => {
    const cleanCommand = command.trim().toLowerCase();
    
    if (!cleanCommand) return;

    console.log('Processing command:', cleanCommand);
    
    setTranscript(`"${command}"`);
    setInterimText('Processing...');
    
    // Enhanced command patterns
    const patterns = [
      { regex: /(?:add|create|new)\s+(?:a\s+)?task\s+(.+?)(?:\s+(?:at|for|by)\s+(.+))?$/i, type: 'task' },
      { regex: /(?:remind|tell)\s+me\s+to\s+(.+?)(?:\s+(?:at|by|for)\s+(.+))?$/i, type: 'task' },
      { regex: /schedule\s+(.+?)(?:\s+(?:at|for|by)\s+(.+))?$/i, type: 'task' },
      { regex: /^([a-z\s]+?)(?:\s+(?:at|by|for)\s+(.+))$/i, type: 'direct' },
    ];

    let matched = false;

    for (const pattern of patterns) {
      const match = cleanCommand.match(pattern.regex);
      
      if (match) {
        matched = true;
        const today = new Date().toISOString().split('T')[0];
        const taskTitle = match[1].trim();
        const taskTime = match[2]?.trim();
        
        const formattedTitle = taskTitle.charAt(0).toUpperCase() + taskTitle.slice(1);
        
        console.log('Adding task:', { title: formattedTitle, time: taskTime });
        
        onAddTask({
          title: formattedTitle,
          time: taskTime ? formatTime(taskTime) : undefined,
          completed: false,
          date: today,
        });
        
        const timeText = taskTime ? ` at ${formatTime(taskTime)}` : '';
        setTranscript(`✓ Task added: "${formattedTitle}"${timeText}`);
        setInterimText('');
        
        // Stop listening and close
        setTimeout(() => {
          stopListening();
          setTimeout(() => {
            onClose();
          }, 1500);
        }, 500);
        
        break;
      }
    }

    if (!matched) {
      setTranscript(`❌ Didn't understand. Try saying:\n"Add task review presentation"\n"Remind me to call client at 3 PM"`);
      setInterimText('');
      
      // Reset and keep listening
      setTimeout(() => {
        setTranscript('');
        finalTranscriptRef.current = '';
        if (!isListening && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.error('Restart error:', e);
          }
        }
      }, 3000);
    }
  };

  const formatTime = (timeStr: string): string => {
    const cleaned = timeStr.toLowerCase().replace(/\s+/g, ' ').trim();
    
    const patterns = [
      { regex: /^(\d{1,2})\s*(?:pm|p\.?m\.?)$/i, format: (h: number) => `${h === 12 ? 12 : h}:00 PM` },
      { regex: /^(\d{1,2})\s*(?:am|a\.?m\.?)$/i, format: (h: number) => `${h === 12 ? 12 : h}:00 AM` },
      { regex: /^(\d{1,2}):(\d{2})\s*(?:pm|p\.?m\.?)$/i, format: (h: number, m: string) => `${h === 12 ? 12 : h}:${m} PM` },
      { regex: /^(\d{1,2}):(\d{2})\s*(?:am|a\.?m\.?)$/i, format: (h: number, m: string) => `${h === 12 ? 12 : h}:${m} AM` },
      { regex: /^(\d{1,2})\s+thirty$/i, format: (h: number) => `${h}:30` },
      { regex: /^(\d{1,2})\s+fifteen$/i, format: (h: number) => `${h}:15` },
      { regex: /^(\d{1,2})\s+forty[- ]?five$/i, format: (h: number) => `${h}:45` },
      { regex: /^(\d{2}):?(\d{2})$/i, format: (h: number, m: string) => {
        if (h > 12) return `${h - 12}:${m} PM`;
        if (h === 12) return `12:${m} PM`;
        if (h === 0) return `12:${m} AM`;
        return `${h}:${m} AM`;
      }},
    ];

    for (const pattern of patterns) {
      const match = cleaned.match(pattern.regex);
      if (match) {
        const hour = parseInt(match[1]);
        const minute = match[2] || '00';
        return pattern.format(hour, minute);
      }
    }

    return timeStr;
  };

  const handleStartListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        finalTranscriptRef.current = '';
        setTranscript('');
        setError('');
        recognitionRef.current.start();
      } catch (e) {
        console.error('Failed to start recognition:', e);
        setError('Failed to start voice recognition. Please try again.');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Failed to stop recognition:', e);
      }
    }
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
    }
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

      <h2 className="text-3xl mb-8 font-bold">Voice Assistant</h2>

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
          onClick={isListening ? stopListening : handleStartListening}
          disabled={!!error && error.includes('not supported')}
          className={`w-32 h-32 rounded-full flex items-center justify-center relative ${
            darkMode ? 'bg-white text-black' : 'bg-black text-white'
          } ${isListening ? 'ring-4 ring-offset-4 ' + (darkMode ? 'ring-white ring-offset-black' : 'ring-black ring-offset-white') : ''} disabled:opacity-50`}
          whileHover={!isListening ? { scale: 1.05 } : {}}
          whileTap={!isListening ? { scale: 0.95 } : {}}
        >
          <Mic className="w-16 h-16" />
        </motion.button>

        {isListening && (
          <>
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
            <motion.div
              className={`absolute inset-0 rounded-full border-2 ${
                darkMode ? 'border-white' : 'border-black'
              }`}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{
                scale: [1, 1.3, 1.6],
                opacity: [0.8, 0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 0.3,
              }}
            />
          </>
        )}
      </motion.div>

      {error && (
        <motion.div
          className={`rounded-2xl px-8 py-6 max-w-md mb-4 ${
            darkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-100 text-red-900'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-semibold">{error}</p>
        </motion.div>
      )}

      {interimText && !error && (
        <motion.div
          className={`rounded-2xl px-8 py-6 max-w-md mb-4 ${
            darkMode ? 'bg-white/10 text-white/60' : 'bg-black/5 text-black/60'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p className="italic">{interimText}</p>
        </motion.div>
      )}

      {transcript && !error && (
        <motion.div
          className={`rounded-2xl px-8 py-6 max-w-md whitespace-pre-line ${
            darkMode ? 'bg-white text-black' : 'bg-black text-white'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-medium">{transcript}</p>
        </motion.div>
      )}

      {isListening && !interimText && (
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

      {!isListening && !transcript && !error && (
        <motion.div
          className="mt-8 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <p className={`text-lg ${darkMode ? 'text-white/60' : 'text-black/60'}`}>
            Tap the microphone and speak clearly
          </p>
          <div className={`text-sm ${darkMode ? 'text-white/40' : 'text-black/40'}`}>
            <p className="mb-3 font-semibold">Try these commands:</p>
            <ul className="space-y-2 text-left max-w-sm mx-auto">
              <li>• "Add task review presentation"</li>
              <li>• "Remind me to call client at 3 PM"</li>
              <li>• "Schedule meeting for tomorrow at 10"</li>
              <li>• "Create task finish report"</li>
            </ul>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}