import { useState, useEffect } from 'react';
import { MotionButton } from "@/components/ui/motion-button";
import { MotionLink } from "@/components/ui/motion-link";
import {
  Menu,
  X,
  Sparkles,
  BookOpen,
  Wrench,
  MessageSquare,
  Layers,
  TestTube,
  Link2,
  Briefcase,
  Settings
} from "lucide-react";
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Close mobile menu if open
      setMobileMenuOpen(false);

      // Set active section
      setActiveSection(sectionId);

      // Scroll to section with smooth behavior
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Determine active section based on scroll position
      const sections = ['services', 'projects', 'experience', 'certifications', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        <MotionLink
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-gray-900 transition-colors hover:text-teal-500 duration-300 p-0"
          whileHover={{ color: "rgb(20, 184, 166)" }}
        >
          <Sparkles className="w-6 h-6" />
          <span>Nam Le</span>
        </MotionLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <MotionButton
            onClick={() => window.location.href = '/blog'}
            className={`flex items-center text-gray-700 hover:text-teal-500 transition-all duration-300 text-sm font-medium ${location.pathname.includes('/blog') ? 'text-teal-500' : ''}`}
            whileHover={{ y: -2, color: "rgb(20, 184, 166)" }}
            whileTap={{ scale: 0.95 }}
            variant="ghost"
          >
            <BookOpen className="w-4 h-4 mr-1" />
            Blogs
          </MotionButton>

          <MotionButton
            onClick={() => window.location.href = '/projects'}
            className={`flex items-center text-gray-700 hover:text-teal-500 transition-all duration-300 text-sm font-medium ${location.pathname.includes('/projects') ? 'text-teal-500' : ''}`}
            whileHover={{ y: -2, color: "rgb(20, 184, 166)" }}
            whileTap={{ scale: 0.95 }}
            variant="ghost"
          >
            <Layers className="w-4 h-4 mr-1" />
            Projects
          </MotionButton>

          <MotionButton
            onClick={() => window.location.href = '/services'}
            className={`flex items-center text-gray-700 hover:text-teal-500 transition-all duration-300 text-sm font-medium ${location.pathname.includes('/services') ? 'text-teal-500' : ''}`}
            whileHover={{ y: -2, color: "rgb(20, 184, 166)" }}
            whileTap={{ scale: 0.95 }}
            variant="ghost"
          >
            <Briefcase className="w-4 h-4 mr-1" />
            Services
          </MotionButton>

          <MotionButton
            onClick={() => window.location.href = '/professional-tools'}
            className={`flex items-center text-gray-700 hover:text-teal-500 transition-all duration-300 text-sm font-medium ${location.pathname.includes('/professional-tools') ? 'text-teal-500' : ''}`}
            whileHover={{ y: -2, color: "rgb(20, 184, 166)" }}
            whileTap={{ scale: 0.95 }}
            variant="ghost"
          >
            <Settings className="w-4 h-4 mr-1" />
            QA Tools
          </MotionButton>

          <MotionButton
            onClick={() => window.location.href = '/resources'}
            className={`flex items-center text-gray-700 hover:text-teal-500 transition-all duration-300 text-sm font-medium ${location.pathname.includes('/resources') ? 'text-teal-500' : ''}`}
            whileHover={{ y: -2, color: "rgb(20, 184, 166)" }}
            whileTap={{ scale: 0.95 }}
            variant="ghost"
          >
            <Wrench className="w-4 h-4 mr-1" />
            Resources
          </MotionButton>

          <MotionButton
            onClick={() => window.location.href = '/not-found'}
            className={`flex items-center text-gray-700 hover:text-teal-500 transition-all duration-300 text-sm font-medium ${location.pathname.includes('/url-shortener') ? 'text-teal-500' : ''}`}
            whileHover={{ y: -2, color: "rgb(20, 184, 166)" }}
            whileTap={{ scale: 0.95 }}
            variant="ghost"
          >
            <Link2 className="w-4 h-4 mr-1" />
            URL Shortener
          </MotionButton>

          <MotionButton
            onClick={() => window.location.href = '/playground'}
            className={`flex items-center text-gray-700 hover:text-teal-500 transition-all duration-300 text-sm font-medium ${location.pathname.includes('/playground') ? 'text-teal-500' : ''}`}
            whileHover={{ y: -2, color: "rgb(20, 184, 166)" }}
            whileTap={{ scale: 0.95 }}
            variant="ghost"
          >
            <TestTube className="w-4 h-4 mr-1" />
            Testing Playground
          </MotionButton>

          <MotionButton
            className="bg-black hover:bg-gray-800 rounded-full px-5 py-2 text-sm font-medium text-white flex items-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, mass: 1 }}
            onClick={() => window.location.href = '/contact-form'}
          >
            <MessageSquare className="w-4 h-4 mr-1.5" />
            Contact Me
          </MotionButton>
        </nav>

        {/* Mobile menu button */}
        <motion.button
          className="md:hidden text-gray-700 bg-white/80 p-2 rounded-full shadow-sm btn-transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.95)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, mass: 1 }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden bg-white/95 backdrop-blur-md absolute w-full shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            <MotionButton
              onClick={() => window.location.href = '/blog'}
              className={`flex items-center text-gray-700 hover:text-teal-500 transition-colors py-2 border-b border-gray-100 px-4 rounded-lg hover:bg-gray-50 w-full justify-start ${location.pathname.includes('/blog') ? 'text-teal-500 bg-gray-50' : ''}`}
              whileHover={{ x: 5, backgroundColor: "rgb(249, 250, 251)" }}
              whileTap={{ scale: 0.98 }}
              variant="ghost"
              transitionType="tween"
              transitionDuration={0.2}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Blog
            </MotionButton>

            <MotionButton
              onClick={() => window.location.href = '/projects'}
              className={`flex items-center text-gray-700 hover:text-teal-500 transition-colors py-2 border-b border-gray-100 px-4 rounded-lg hover:bg-gray-50 w-full justify-start ${location.pathname.includes('/projects') ? 'text-teal-500 bg-gray-50' : ''}`}
              whileHover={{ x: 5, backgroundColor: "rgb(249, 250, 251)" }}
              whileTap={{ scale: 0.98 }}
              variant="ghost"
              transitionType="tween"
              transitionDuration={0.2}
            >
              <Layers className="w-4 h-4 mr-2" />
              Projects
            </MotionButton>

            <MotionButton
              onClick={() => window.location.href = '/services'}
              className={`flex items-center text-gray-700 hover:text-teal-500 transition-colors py-2 border-b border-gray-100 px-4 rounded-lg hover:bg-gray-50 w-full justify-start ${location.pathname.includes('/services') ? 'text-teal-500 bg-gray-50' : ''}`}
              whileHover={{ x: 5, backgroundColor: "rgb(249, 250, 251)" }}
              whileTap={{ scale: 0.98 }}
              variant="ghost"
              transitionType="tween"
              transitionDuration={0.2}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Services
            </MotionButton>

            <MotionButton
              onClick={() => window.location.href = '/professional-tools'}
              className={`flex items-center text-gray-700 hover:text-teal-500 transition-colors py-2 border-b border-gray-100 px-4 rounded-lg hover:bg-gray-50 w-full justify-start ${location.pathname.includes('/professional-tools') ? 'text-teal-500 bg-gray-50' : ''}`}
              whileHover={{ x: 5, backgroundColor: "rgb(249, 250, 251)" }}
              whileTap={{ scale: 0.98 }}
              variant="ghost"
              transitionType="tween"
              transitionDuration={0.2}
            >
              <Settings className="w-4 h-4 mr-2" />
              QA Tools
            </MotionButton>

            <MotionButton
              onClick={() => window.location.href = '/resources'}
              className={`flex items-center text-gray-700 hover:text-teal-500 transition-colors py-2 border-b border-gray-100 px-4 rounded-lg hover:bg-gray-50 w-full justify-start ${location.pathname.includes('/resources') ? 'text-teal-500 bg-gray-50' : ''}`}
              whileHover={{ x: 5, backgroundColor: "rgb(249, 250, 251)" }}
              whileTap={{ scale: 0.98 }}
              variant="ghost"
              transitionType="tween"
              transitionDuration={0.2}
            >
              <Wrench className="w-4 h-4 mr-2" />
              Resources
            </MotionButton>

            <MotionButton
              onClick={() => window.location.href = '/url-shortener'}
              className={`flex items-center text-gray-700 hover:text-teal-500 transition-colors py-2 border-b border-gray-100 px-4 rounded-lg hover:bg-gray-50 w-full justify-start ${location.pathname.includes('/url-shortener') ? 'text-teal-500 bg-gray-50' : ''}`}
              whileHover={{ x: 5, backgroundColor: "rgb(249, 250, 251)" }}
              whileTap={{ scale: 0.98 }}
              variant="ghost"
              transitionType="tween"
              transitionDuration={0.2}
            >
              <Link2 className="w-4 h-4 mr-2" />
              URL Shortener
            </MotionButton>

            <MotionButton
              onClick={() => window.location.href = '/playground'}
              className={`flex items-center text-gray-700 hover:text-teal-500 transition-colors py-2 border-b border-gray-100 px-4 rounded-lg hover:bg-gray-50 w-full justify-start ${location.pathname.includes('/playground') ? 'text-teal-500 bg-gray-50' : ''}`}
              whileHover={{ x: 5, backgroundColor: "rgb(249, 250, 251)" }}
              whileTap={{ scale: 0.98 }}
              variant="ghost"
              transitionType="tween"
              transitionDuration={0.2}
            >
              <TestTube className="w-4 h-4 mr-2" />
              Testing Playground
            </MotionButton>

            <MotionButton
              className="bg-black hover:bg-gray-800 rounded-full px-5 py-2 text-white mt-3 flex items-center justify-center"
              onClick={() => window.location.href = '/contact-form'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, mass: 1 }}
            >
              <MessageSquare className="w-4 h-4 mr-1.5" />
              Contact Me
            </MotionButton>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
