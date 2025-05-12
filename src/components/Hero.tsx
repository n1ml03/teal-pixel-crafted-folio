import {
  Mail as MailIcon,
  ArrowDown,
  Code,
  TestTube,
  Sparkles,
  Github,
  Linkedin,
  ArrowRight,
  BookOpen
} from "lucide-react";
import { motion } from 'framer-motion';
import { MotionButton } from "@/components/ui/motion-button";
import { MotionLink } from "@/components/ui/motion-link";
import { Parallax } from 'react-scroll-parallax';
import { TypeAnimation } from 'react-type-animation';
import { Badge } from "@/components/ui/badge";

import { ScrollReveal } from "@/components/ui/scroll-reveal";

const Hero = () => {

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Scroll to section with smooth behavior
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Tech stack items
  const techStack = [
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Jest", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" },
    { name: "Cypress", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cypressio/cypressio-original.svg" },
    { name: "JIRA", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jira/jira-original.svg" },
    { name: "Flaywright", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/playwright/playwright-original.svg" }
  ];

  return (
    <div className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Modern abstract background with gradients and shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Animated floating elements */}
        <Parallax translateY={['-10%', '10%']} className="absolute top-[15%] right-[20%]">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-teal-400/10 to-teal-200/20 backdrop-blur-sm border border-white/20 transform rotate-12"></div>
        </Parallax>

        <Parallax translateY={['5%', '-5%']} className="absolute bottom-[20%] left-[15%]">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-400/10 to-blue-200/20 backdrop-blur-sm border border-white/20"></div>
        </Parallax>

        <Parallax translateY={['-10%', '10%']} className="absolute top-[40%] left-[10%]">
          <div className="w-32 h-12 rounded-full bg-gradient-to-r from-lavender-300/10 to-lavender-100/20 backdrop-blur-sm border border-white/20"></div>
        </Parallax>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 mb-16 lg:mb-0 lg:pr-12 relative">
            {/* Fixed content that doesn't move - increased z-index to ensure it stays above any parallax effects */}
            <div className="relative z-20">
              <ScrollReveal
                delay={0.2}
                duration={0.7}
                className="text-center lg:text-left"
              >
                <Badge
                  variant="secondary"
                  className="mb-6 bg-teal-50 text-teal-700 hover:bg-teal-100 px-4 py-1.5 text-sm font-medium inline-flex items-center"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-2 text-teal-500" />
                  AVAILABLE FOR WORK
                </Badge>

                <div className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                  <TypeAnimation
                    sequence={[
                      'Hi, I\'m Nam\nDeveloper &\nQA Engineer',
                      2000,
                      'Hi, I\'m Nam\nFull-Stack\nDeveloper',
                      2000,
                      'Hi, I\'m Nam\nQA\nSpecialist',
                      2000,
                    ]}
                    wrapper="h1"
                    speed={50}
                    style={{
                      whiteSpace: 'pre-line',
                      display: 'block',
                      background: 'linear-gradient(to right, #0d9488, #14b8a6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                    repeat={Infinity}
                    cursor={true}
                  />
                </div>

                <motion.p
                  className="text-lg text-gray-600 mb-10 max-w-lg mx-auto lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  Passionate Developer and QA Engineer with expertise in building robust software solutions
                  through meticulous development and comprehensive testing. Let's create something amazing together.
                </motion.p>

                <motion.div
                  className="flex flex-wrap gap-4 mb-10 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  <MotionButton
                    className="bg-teal-600 hover:bg-teal-600 text-white rounded-full px-6 py-3 text-sm font-medium flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection('contact')}
                  >
                    Contact Me
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </MotionButton>

                  {/* <MotionButton
                    className="bg-white hover:bg-gray-50 text-gray-800 rounded-full px-6 py-3 text-sm font-medium border border-gray-200 shadow-md flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // Create a link to download the CV
                      const link = document.createElement('a');
                      link.href = '/CV Le Van Nam - Intern Tester.pdf';
                      link.download = 'CV_Le_Van_Nam.pdf';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <Download className="mr-2 w-4 h-4" />
                    Download CV
                  </MotionButton> */}
                </motion.div>

                {/* Social links for desktop */}
                <motion.div
                  className="hidden md:flex items-center gap-5 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  <MotionLink
                    href="https://github.com/n1ml03"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github size={20} />
                  </MotionLink>
                  <MotionLink
                    href="https://linkedin.com/in/pearleseed"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Linkedin size={20} />
                  </MotionLink>
                  <MotionLink
                    href="mailto:pearleseed@gmail.com"
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MailIcon size={20} />
                  </MotionLink>
                  <MotionLink
                    href="/blog"
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <BookOpen size={20} />
                  </MotionLink>
                </motion.div>

                {/* Social links for mobile with text */}
                <motion.div
                  className="md:hidden flex flex-wrap gap-3 justify-center mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  <MotionLink
                    href="https://github.com/n1ml03"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-teal-50 hover:text-teal-600 px-4 py-2 rounded-full transition-colors"
                    whileHover={{ y: -2, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Github size={18} />
                    <span className="text-sm font-medium">GitHub</span>
                  </MotionLink>
                  <MotionLink
                    href="https://linkedin.com/in/pearleseed"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-4 py-2 rounded-full transition-colors"
                    whileHover={{ y: -2, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Linkedin size={18} />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </MotionLink>
                  <MotionLink
                    href="mailto:pearleseed@gmail.com"
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-500 px-4 py-2 rounded-full transition-colors"
                    whileHover={{ y: -2, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <MailIcon size={18} />
                    <span className="text-sm font-medium">Email</span>
                  </MotionLink>
                  <MotionLink
                    href="/blog"
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-teal-50 hover:text-teal-600 px-4 py-2 rounded-full transition-colors"
                    whileHover={{ y: -2, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <BookOpen size={18} />
                    <span className="text-sm font-medium">Blog</span>
                  </MotionLink>
                </motion.div>

                {/* Scroll down indicator */}
                <motion.div
                  className="hidden lg:flex items-center mt-16 text-gray-400 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowDown className="w-4 h-4 mr-2" />
                  </motion.div>
                  <span>Scroll to explore</span>
                </motion.div>
              </ScrollReveal>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-1/2 relative">
            {/* Parallax background effect - placed first so it's behind the content */}
            <div className="absolute inset-0 pointer-events-none -z-10">
              <Parallax translateY={['-10%', '10%']} className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-teal-50/10 to-transparent rounded-3xl transform scale-110"></div>
              </Parallax>
            </div>

            {/* Fixed content that doesn't move - higher z-index to stay above parallax */}
            <div className="relative z-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                  <div className="flex flex-col">
                    {/* Profile info */}
                    <div className="mb-6 flex items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-teal-100">
                        <img
                          src="/images/developer-portrait.jpg"
                          alt="Developer portrait"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to a default image if the local image fails to load
                            e.currentTarget.src = "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=1000";
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1 text-gray-800">Nam Le</h3>
                        <div className="flex items-center">
                          <Badge className="bg-teal-50 text-teal-700 mr-2">Developer</Badge>
                          <Badge className="bg-blue-50 text-blue-700">QA Engineer</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Work preview images */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="group relative overflow-hidden rounded-xl aspect-video">
                        <img
                          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000"
                          alt="Coding preview"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-3 text-white">
                            <div className="flex items-center">
                              <Code className="w-4 h-4 mr-2" />
                              <span className="text-sm font-medium">Development</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="group relative overflow-hidden rounded-xl aspect-video">
                        <img
                          src="https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1000"
                          alt="Testing preview"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-3 text-white">
                            <div className="flex items-center">
                              <TestTube className="w-4 h-4 mr-2" />
                              <span className="text-sm font-medium">Testing</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Skills section */}
                    <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-5 mb-4">
                      <h4 className="text-sm font-semibold mb-4 text-gray-700">Technologies I work with</h4>
                      <div className="flex flex-wrap gap-3">
                        {techStack.map((tech, index) => (
                          <motion.div
                            key={index}
                            className="bg-white rounded-lg p-2 shadow-sm flex items-center gap-2 border border-gray-100"
                            whileHover={{ y: -3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                          >
                            <img src={tech.icon} alt={tech.name} className="w-5 h-5" />
                            <span className="text-xs font-medium text-gray-700">{tech.name}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-teal-600">1+</div>
                        <div className="text-xs text-gray-500">Years Experience</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-teal-600">5+</div>
                        <div className="text-xs text-gray-500">Projects</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-teal-600">100%</div>
                        <div className="text-xs text-gray-500">Satisfaction</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -z-10 -top-6 -right-6 w-32 h-32 bg-teal-50 rounded-full"></div>
                <div className="absolute -z-10 -bottom-6 -left-6 w-32 h-32 bg-blue-50 rounded-full"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
