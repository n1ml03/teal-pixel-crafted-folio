import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { MotionButton } from "@/components/ui/motion-button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal-50 rounded-full opacity-50"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-50 rounded-full opacity-50"></div>

      <motion.div
        className="relative z-10 bg-white rounded-2xl p-12 shadow-lg border border-gray-100 max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-2xl font-bold mb-4 text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-400">
            PAGE NOT FOUND
          </span>
        </motion.h2>

        <motion.h1
          className="text-7xl font-bold mb-6 text-gray-800 relative inline-block"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 10,
            delay: 0.2
          }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-400">
            404
          </span>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-teal-500 rounded-full"></div>
        </motion.h1>

        <p className="text-xl text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <MotionButton
          className="bg-teal-500 hover:bg-teal-600 rounded-full px-6 py-2.5 text-sm font-medium text-white flex items-center mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/'}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Home
        </MotionButton>
      </motion.div>
    </div>
  );
};

export default NotFound;
