import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import UserDashboard from '@/components/playground/UserDashboard';
import EnhancedBackground from '@/components/utils/EnhancedBackground';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { softSpringTransition } from '@/lib/motion';

const Dashboard = () => {
  const { isLoading: isAuthLoading } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  const [isLoaded, setIsLoaded] = useState(false);

  // Set loaded state after a small delay to ensure smooth entrance animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Animation variants for the main content
  const mainContentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        duration: 0.3
      }
    }
  };

  // Animation variants for individual elements
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ...softSpringTransition,
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Enhanced background with gradient and animated elements */}
      <EnhancedBackground
        optimizeForLowPerformance={false}
        reducedAnimations={prefersReducedMotion || false}
      />

      <AnimatePresence mode="wait">
        <motion.main
          className="container py-6 pt-24 relative z-10"
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={mainContentVariants}
          key="dashboard-main"
        >
          <motion.h1
            className="text-3xl font-bold mb-6"
            variants={itemVariants}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
          >
            My Dashboard
          </motion.h1>

          {isAuthLoading ? (
            <motion.div
              className="flex justify-center items-center py-12"
              variants={itemVariants}
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full"
            >
              <UserDashboard />
            </motion.div>
          )}
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
