import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import UserDashboard from '@/components/playground/UserDashboard';
import { useAuth } from '@/contexts/auth-utils';
import { useState, useEffect } from 'react';
import { softSpringTransition } from '@/lib/motion';
import { useMediaQuery } from '@/lib';

const Dashboard = () => {
  const { isLoading: isAuthLoading } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
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
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.main
          className="container py-6 pt-24 relative z-10"
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={mainContentVariants}
          key="dashboard-main"
          style={{ contentVisibility: 'auto', containIntrinsicSize: '0 600px' }}
        >
          <motion.div
            className="mb-6 p-6 bg-gradient-to-r from-blue-500/10 via-teal-500/10 to-purple-500/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg"
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
            <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600`}>
              My Dashboard
            </h1>
            <p className={`text-gray-700 ${isMobile ? 'text-sm' : 'text-base'}`}>
              Track your testing progress, view completed challenges, and access your performance metrics.
            </p>
          </motion.div>

          {isAuthLoading ? (
            <motion.div
              className="flex justify-center items-center py-12"
              variants={itemVariants}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-gray-600 text-center">Loading your dashboard...</p>
              </div>
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
