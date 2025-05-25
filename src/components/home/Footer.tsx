
import { MotionLink } from "@/components/ui/motion-link.tsx";
import { MotionButton } from "@/components/ui/motion-button.tsx";
import { Github, Linkedin, Mail, Sparkles, BookOpen, Home, Code, Layers, Briefcase, Award, Wrench, ArrowUp } from "lucide-react";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-transparent pt-16 pb-8 relative">
      <div className="container mx-auto px-4">
        {/* Scroll to top button for mobile - fixed position */}
        <motion.div
          className="fixed bottom-6 right-6 z-40 md:hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <MotionButton
            onClick={scrollToTop}
            className="bg-white/90 backdrop-blur-sm text-gray-700 hover:text-teal-600 p-3 rounded-full border border-gray-200/50 shadow-md"
            whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </MotionButton>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12">
          <div className="mb-8 md:mb-0 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4 backdrop-blur-sm bg-white/70 px-4 py-2 rounded-lg shadow-sm">
              <Sparkles className="w-6 h-6 text-teal-500" />
              <span>Nam Le</span>
            </div>
            <p className="text-gray-700 max-w-md backdrop-blur-sm bg-white/50 px-4 py-3 rounded-lg shadow-sm">
              Developer & QA Engineer specializing in building robust software solutions through meticulous development and comprehensive testing.
            </p>

            {/* Social links for mobile - moved from the grid */}
            <div className="mt-6 flex space-x-3 md:hidden">
              <MotionLink
                href="https://github.com/n1ml03"
                className="bg-white/80 p-3 rounded-full text-gray-700 hover:text-teal-600 border border-gray-200/50 shadow-sm backdrop-blur-sm"
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.95 }}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </MotionLink>

              <MotionLink
                href="https://linkedin.com/in/pearleseed"
                className="bg-white/80 p-3 rounded-full text-gray-700 hover:text-teal-600 border border-gray-200/50 shadow-sm backdrop-blur-sm"
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.95 }}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </MotionLink>

              <MotionLink
                href="mailto:pearleseed@gmail.com"
                className="bg-white/80 p-3 rounded-full text-gray-700 hover:text-teal-600 border border-gray-200/50 shadow-sm backdrop-blur-sm"
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.95 }}
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </MotionLink>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full md:w-auto">
            <div className="backdrop-blur-sm bg-white/50 px-5 py-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900 mb-3">Navigation</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/" className="text-gray-700 hover:text-teal-600 transition-colors flex items-center">
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-gray-700 hover:text-teal-600 transition-colors flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/resources" className="text-gray-700 hover:text-teal-600 transition-colors flex items-center">
                    <Wrench className="w-4 h-4 mr-2" />
                    Resources
                  </Link>
                </li>
                <li>
                  <a href="/home#services" className="text-gray-700 hover:text-teal-600 transition-colors flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    Services
                  </a>
                </li>
                <li>
                  <Link to="/projects" className="text-gray-700 hover:text-teal-600 transition-colors flex items-center">
                    <Layers className="w-4 h-4 mr-2" />
                    Projects
                  </Link>
                </li>
              </ul>
            </div>

            <div className="backdrop-blur-sm bg-white/50 px-5 py-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900 mb-3">More</h3>
              <ul className="space-y-2.5">
                <li>
                  <a href="/home#experience" className="text-gray-700 hover:text-teal-600 transition-colors flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Experience
                  </a>
                </li>
                <li>
                  <a href="/home#certifications" className="text-gray-700 hover:text-teal-600 transition-colors flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Certifications
                  </a>
                </li>
                <li>
                  <a href="/contact-form" className="text-gray-700 hover:text-teal-600 transition-colors flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className="backdrop-blur-sm bg-white/50 px-5 py-4 rounded-lg shadow-sm hidden md:block">
              <h3 className="font-medium text-gray-900 mb-3">Connect</h3>
              <div className="flex space-x-3">
                <MotionLink
                  href="https://github.com/n1ml03"
                  className="bg-white/80 p-3 rounded-full text-gray-700 hover:text-teal-600 border border-gray-200/50 shadow-sm backdrop-blur-sm"
                  whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </MotionLink>

                <MotionLink
                  href="https://linkedin.com/in/pearleseed"
                  className="bg-white/80 p-3 rounded-full text-gray-700 hover:text-teal-600 border border-gray-200/50 shadow-sm backdrop-blur-sm"
                  whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </MotionLink>

                <MotionLink
                  href="mailto:pearleseed@gmail.com"
                  className="bg-white/80 p-3 rounded-full text-gray-700 hover:text-teal-600 border border-gray-200/50 shadow-sm backdrop-blur-sm"
                  whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </MotionLink>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200/50 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Nam Le. All rights reserved.
          </p>

          <div className="hidden md:block">
            <MotionButton
              onClick={scrollToTop}
              className="bg-white/90 backdrop-blur-sm text-gray-700 hover:text-gray-800 hover:bg-white p-3 rounded-full border border-gray-200/50 shadow-md"
              whileHover={{ boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.1)", scale: 1.05 }}
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

export default Footer;
