import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Award, Star, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

interface CompletionAnimationProps {
  show: boolean;
  type?: 'objective' | 'challenge' | 'test';
  message?: string;
  onComplete?: () => void;
  className?: string;
}

export const CompletionAnimation = ({
  show,
  type = 'objective',
  message,
  onComplete,
  className
}: CompletionAnimationProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  // Trigger confetti when the animation shows
  useEffect(() => {
    if (show && (type === 'challenge' || type === 'test')) {
      setShowConfetti(true);
      
      // For challenge completion, show a more elaborate confetti
      if (type === 'challenge') {
        const duration = 500;
        const end = Date.now() + duration;
        
        const frame = () => {
          confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#26a69a', '#00897b', '#004d40']
          });
          
          confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#26a69a', '#00897b', '#004d40']
          });
          
          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        
        frame();
      } else {
        // Simpler confetti for test completion
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#26a69a', '#00897b', '#004d40']
        });
      }
      
      // Hide confetti after animation
      const timer = setTimeout(() => {
        setShowConfetti(false);
        if (onComplete) onComplete();
      }, type === 'challenge' ? 4000 : 2000);
      
      return () => clearTimeout(timer);
    }
  }, [show, type, onComplete]);

  // Different icons based on completion type
  const getIcon = () => {
    switch (type) {
      case 'challenge':
        return <Trophy className="h-12 w-12 text-yellow-500" />;
      case 'test':
        return <CheckCircle className="h-10 w-10 text-green-500" />;
      default:
        return <CheckCircle className="h-8 w-8 text-green-500" />;
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30 
          }}
          className={cn(
            "fixed inset-0 flex items-center justify-center z-50 pointer-events-none",
            className
          )}
        >
          <motion.div
            className={cn(
              "bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border-2 flex flex-col items-center text-center max-w-md relative overflow-hidden",
              type === 'challenge' ? "border-yellow-300/60 shadow-yellow-200/50" : "border-green-300/60 shadow-green-200/50"
            )}
            initial={{ y: 20, scale: 0.9 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Background gradient overlay */}
            <div className={cn(
              "absolute inset-0 opacity-20",
              type === 'challenge' 
                ? "bg-gradient-to-br from-yellow-100 via-orange-50 to-red-50" 
                : "bg-gradient-to-br from-green-100 via-teal-50 to-blue-50"
            )} />
            
            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "absolute w-2 h-2 rounded-full opacity-30",
                    type === 'challenge' ? "bg-yellow-400" : "bg-green-400"
                  )}
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${10 + (i % 2) * 60}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2 + i * 0.2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            
            {/* Content container */}
            <div className="relative z-10">
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 20,
                delay: 0.2
              }}
              className="relative mb-4"
            >
              {getIcon()}
              
              {/* Sparkles animation for challenge completion */}
              {type === 'challenge' && (
                <>
                  <motion.div
                    className="absolute -top-2 -right-2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Sparkles className="h-5 w-5 text-yellow-400" />
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-1 -left-2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Star className="h-4 w-4 text-yellow-500" />
                  </motion.div>
                </>
              )}
            </motion.div>
            
            <motion.h3
              className={cn(
                "text-lg font-bold mb-1",
                type === 'challenge' ? "text-yellow-700" : "text-green-700"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {type === 'challenge' 
                ? 'Challenge Completed!' 
                : type === 'test' 
                  ? 'Test Passed!' 
                  : 'Objective Completed!'}
            </motion.h3>
            
            {message && (
              <motion.p
                className="text-sm text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {message}
              </motion.p>
            )}
            
            {type === 'challenge' && (
              <motion.div
                className="mt-3 flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Award className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-700">+50 points earned</span>
              </motion.div>
            )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompletionAnimation;
