import { MotionLink } from "@/components/ui/motion-link.tsx";
import { MotionButton } from "@/components/ui/motion-button.tsx";
import {
  Github,
  Linkedin,
  Mail,
  Sparkles,
  BookOpen,
  Home,
  Code,
  Target,
  Trophy,
  Award,
  Wrench,
  ArrowUp,
  HelpCircle
} from "lucide-react";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

const PlaygroundFooter = () => {
  const prefersReducedMotion = useReducedMotion();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-transparent pt-8 pb-6 relative mt-auto z-10">
      {/* Enhanced gradient overlay that perfectly integrates with EnhancedBackground */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-100/40 via-teal-50/20 to-transparent backdrop-blur-[2px] pointer-events-none"></div>
      {/* Additional subtle gradient layer to match the animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-200/10 via-blue-300/10 to-purple-200/10 opacity-30 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative">
        {/* Scroll to top button for mobile - fixed position */}
        <motion.div
          className="fixed bottom-6 right-6 z-40 md:hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <MotionButton
            onClick={scrollToTop}
            className="bg-white/80 backdrop-blur-md text-gray-700 hover:text-primary p-3 rounded-full border border-white/50 shadow-md hover:shadow-lg transition-all duration-300"
            whileHover={!prefersReducedMotion ? { y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" } : {}}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </MotionButton>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="backdrop-blur-md bg-white/50 px-5 py-4 rounded-lg shadow-sm border border-white/40 hover:bg-white/60 transition-all duration-300 hover:shadow-md">
            <h3 className="font-medium text-gray-800 mb-3">Testing Playground</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/playground" className="text-gray-700 hover:text-primary transition-colors flex items-center">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/playground/challenges" className="text-gray-700 hover:text-primary transition-colors flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Challenges
                </Link>
              </li>
              <li>
                <Link to="/playground/leaderboard" className="text-gray-700 hover:text-primary transition-colors flex items-center">
                  <Trophy className="w-4 h-4 mr-2" />
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/playground/sandbox" className="text-gray-700 hover:text-primary transition-colors flex items-center">
                  <Code className="w-4 h-4 mr-2" />
                  Sandbox
                </Link>
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-md bg-white/50 px-5 py-4 rounded-lg shadow-sm border border-white/40 hover:bg-white/60 transition-all duration-300 hover:shadow-md">
            <h3 className="font-medium text-gray-800 mb-3">Resources</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/playground/help" className="text-gray-700 hover:text-primary transition-colors flex items-center">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-700 hover:text-primary transition-colors flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-700 hover:text-primary transition-colors flex items-center">
                  <Wrench className="w-4 h-4 mr-2" />
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-md bg-white/50 px-5 py-4 rounded-lg shadow-sm border border-white/40 hover:bg-white/60 transition-all duration-300 hover:shadow-md">
            <h3 className="font-medium text-gray-800 mb-3">Connect</h3>
            <div className="flex space-x-3 mb-4">
              <MotionLink
                href="https://github.com/n1ml03"
                className="bg-white/80 p-3 rounded-full text-gray-700 hover:text-primary border border-white/50 shadow-sm backdrop-blur-md hover:shadow-md transition-all duration-300"
                whileHover={!prefersReducedMotion ? { y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" } : {}}
                whileTap={{ scale: 0.95 }}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </MotionLink>

              <MotionLink
                href="https://linkedin.com/in/namle"
                className="bg-white/80 p-3 rounded-full text-gray-700 hover:text-primary border border-white/50 shadow-sm backdrop-blur-md hover:shadow-md transition-all duration-300"
                whileHover={!prefersReducedMotion ? { y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" } : {}}
                whileTap={{ scale: 0.95 }}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </MotionLink>

              <MotionLink
                href="mailto:contact@namle.dev"
                className="bg-white/80 p-3 rounded-full text-gray-700 hover:text-primary border border-white/50 shadow-sm backdrop-blur-md hover:shadow-md transition-all duration-300"
                whileHover={!prefersReducedMotion ? { y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" } : {}}
                whileTap={{ scale: 0.95 }}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </MotionLink>
            </div>
            <p className="text-sm text-gray-600">
              Have feedback or suggestions for the Testing Playground? We'd love to hear from you!
            </p>
          </div>
        </div>

        <div className="border-t border-white/40 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Nam Le. All rights reserved.
          </p>

          <div className="hidden md:block">
            <MotionButton
              onClick={scrollToTop}
              className="bg-white/80 backdrop-blur-md text-gray-700 hover:text-primary hover:bg-white/90 p-3 rounded-full border border-white/50 shadow-md hover:shadow-lg transition-all duration-300"
              whileHover={!prefersReducedMotion ? { boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.1)", scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </MotionButton>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PlaygroundFooter;
