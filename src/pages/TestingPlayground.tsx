import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedBackground from '@/components/utils/EnhancedBackground';
import {
  TestTube,
  Bug,
  Code,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Wrench,
  Braces,
  Search,
  Play,
  FileCheck,
  MousePointerClick
} from 'lucide-react';
import { MotionButton } from "@/components/ui/motion-button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load heavy components
const DemoApp = lazy(() => import('@/components/playground/DemoApp'));
const PlaygroundTabs = lazy(() => import('@/components/playground/PlaygroundTabs'));

const TestingPlayground: React.FC = () => {
  // Function to handle scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="relative">
        {/* Optimized background for better performance */}
        <EnhancedBackground optimizeForLowPerformance={true} />

        <main id="main-content" className="flex-grow relative z-10">
          {/* Hero Section - Styled like Resources page but wider */}
          <section id="hero" className="relative py-32 overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
              <ScrollReveal>
                <div className="text-center max-w-5xl mx-auto">
                  <Badge
                    variant="secondary"
                    className="mb-6 bg-teal-50 text-teal-700 hover:bg-teal-100 px-5 py-2 text-base font-medium items-center inline-flex rounded-full"
                  >
                    <TestTube className="w-5 h-5 mr-2 text-teal-500" />
                    INTERACTIVE EXPERIENCE
                  </Badge>

                  <motion.h1
                    className="text-5xl md:text-5xl lg:text-7xl font-bold mb-8 leading-tight"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500">
                      Real-time Testing Playground
                    </span>
                  </motion.h1>

                  <motion.p
                    className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Experience how a QA engineer thinks and works. Explore the demo app, run tests, create test cases,
                    compare bug fixes, generate reports, and learn about testing methodologies.
                  </motion.p>

                  {/* Feature badges */}
                  <motion.div
                    className="flex flex-wrap justify-center gap-4 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200 py-2 px-4 flex items-center shadow-sm transition-all duration-200 border hover:bg-purple-200">
                      <Bug className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm font-medium">Bug Fixing</span>
                    </Badge>

                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 py-2 px-4 flex items-center shadow-sm transition-all duration-200 border hover:bg-blue-200">
                      <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm font-medium">Test Case Writing</span>
                    </Badge>

                    <Badge className="bg-amber-100 text-amber-800 border-amber-200 py-2 px-4 flex items-center shadow-sm transition-all duration-200 border hover:bg-amber-200">
                      <Search className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm font-medium">Exploratory Testing</span>
                    </Badge>

                    <Badge className="bg-green-100 text-green-800 border-green-200 py-2 px-4 flex items-center shadow-sm transition-all duration-200 border hover:bg-green-200">
                      <Code className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm font-medium">Automation Testing</span>
                    </Badge>

                    <Badge className="bg-red-100 text-red-800 border-red-200 py-2 px-4 flex items-center shadow-sm transition-all duration-200 border hover:bg-red-200">
                      <Play className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm font-medium">Test Execution</span>
                    </Badge>

                    <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 py-2 px-4 flex items-center shadow-sm transition-all duration-200 border hover:bg-indigo-200">
                      <FileCheck className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm font-medium">Report Generation</span>
                    </Badge>
                  </motion.div>

                  {/* Quick navigation buttons */}
                  <div className="flex flex-wrap justify-center gap-5 mt-12">
                    <MotionButton
                      onClick={() => scrollToSection('demo-app')}
                      className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-3 rounded-lg shadow-md flex items-center text-lg"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                        background: "linear-gradient(to right, #0d9488, #0891b2)"
                      }}
                    >
                      <MousePointerClick className="h-5 w-5 mr-2" />
                      Try Demo App
                    </MotionButton>
                    <MotionButton
                      onClick={() => scrollToSection('qa-artifacts')}
                      className="bg-white text-blue-700 border border-blue-200 px-8 py-3 rounded-lg shadow-sm flex items-center text-lg"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "#f0f9ff"
                      }}
                    >
                      <Braces className="h-5 w-5 mr-2" />
                      View QA Artifacts
                    </MotionButton>
                    <MotionButton
                      onClick={() => scrollToSection('tools-skills')}
                      className="bg-white text-purple-700 border border-purple-200 px-8 py-3 rounded-lg shadow-sm flex items-center text-lg"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "#faf5ff"
                      }}
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      Explore Tools
                    </MotionButton>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Demo Application Section - Now as a full-width section */}
          <section id="demo-app" className="py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="container px-4 mx-auto">
              <ScrollReveal>
                <div className="text-center max-w-3xl mx-auto mb-10">
                  <motion.div
                    className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 mb-6 shadow-sm"
                    whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                  >
                    <Wrench className="h-4 w-4 mr-2 text-teal-600" />
                    <span className="text-sm font-medium">Interactive Demo</span>
                  </motion.div>

                  <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500 bg-clip-text text-transparent">
                    Demo Application
                  </h2>

                  <p className="text-lg text-gray-600">
                    This is a simple To-Do List application that demonstrates proper implementation
                    of task management features. All previous bugs have been fixed for a smooth user experience.
                  </p>
                </div>
              </ScrollReveal>

              <div className="max-w-4xl mx-auto">
                <ScrollReveal className="flex flex-col">
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="mb-4 transform transition-transform duration-300 hover:scale-[1.01]">
                      <Suspense fallback={
                        <div className="flex flex-col space-y-3">
                          <Skeleton className="h-12 w-full rounded-lg" />
                          <Skeleton className="h-32 w-full rounded-lg" />
                          <Skeleton className="h-8 w-1/3 rounded-lg" />
                        </div>
                      }>
                        <DemoApp />
                      </Suspense>
                    </div>

                    <motion.div
                      className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl p-5 mt-6"
                      whileHover={{ boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)" }}
                    >
                      <div className="flex items-start">
                        <div className="bg-white p-2 rounded-full shadow-sm mr-3 flex-shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-green-800 mb-1">Status</h3>
                          <p className="text-green-700 text-sm">
                            All bugs in this application have been fixed! Check the "Fixed Bugs" tab in the QA Artifacts panel below to see what was fixed.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>

          {/* QA Artifacts Section - Now as a separate section below */}
          <section id="qa-artifacts" className="py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="container px-4 mx-auto">
              <ScrollReveal>
                <div className="text-center max-w-3xl mx-auto mb-10">
                  <motion.div
                    className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 mb-6 shadow-sm"
                    whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                  >
                    <Braces className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-sm font-medium">Documentation</span>
                  </motion.div>

                  <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                    QA Artifacts
                  </h2>

                  <p className="text-lg text-gray-600">
                    Explore test cases, bug reports, automation scripts, and interactive testing tools.
                    Run tests, create new test cases, compare bug fixes, and generate test reports.
                  </p>
                </div>
              </ScrollReveal>

              <div className="max-w-6xl mx-auto">
                <ScrollReveal className="flex flex-col">
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="transform transition-transform duration-300 hover:scale-[1.01]">
                      <Suspense fallback={
                        <div className="flex flex-col space-y-4">
                          <div className="flex space-x-2">
                            <Skeleton className="h-10 w-24 rounded-lg" />
                            <Skeleton className="h-10 w-24 rounded-lg" />
                            <Skeleton className="h-10 w-24 rounded-lg" />
                          </div>
                          <Skeleton className="h-64 w-full rounded-lg" />
                        </div>
                      }>
                        <PlaygroundTabs />
                      </Suspense>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>

          {/* Tools & Skills Section - Enhanced with better card design and animations */}
          <section id="tools-skills" className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="container px-4 mx-auto">
              <ScrollReveal>
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <motion.div
                    className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 mb-6 shadow-sm"
                    whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
                    <span className="text-sm font-medium">QA Toolkit</span>
                  </motion.div>

                  <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                    Tools & Skills Showcase
                  </h2>

                  <p className="text-lg text-gray-600">
                    Modern QA engineers use a variety of tools and approaches to ensure software quality.
                    Here's a glimpse of the essential skills in my testing toolkit.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Manual Testing Card */}
                  <motion.div
                    className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  >
                    <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 w-14 h-14 flex items-center justify-center mb-6 shadow-md">
                      <Search className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800">Manual Testing</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Exploratory testing, usability testing, and regression testing to find issues that automated tests might miss.
                    </p>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <MotionButton
                        className="text-sm font-medium bg-purple-50 text-purple-700 px-4 py-2 rounded-lg flex items-center justify-center w-full"
                        whileHover={{
                          scale: 1.03,
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                        }}
                      >
                        Learn more
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </MotionButton>
                    </div>
                  </motion.div>

                  {/* Automation Testing Card */}
                  <motion.div
                    className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  >
                    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 w-14 h-14 flex items-center justify-center mb-6 shadow-md">
                      <Code className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800">Automation Testing</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Creating robust test frameworks with Cypress, Playwright, and Selenium to ensure consistent quality.
                    </p>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <MotionButton
                        className="text-sm font-medium bg-blue-50 text-blue-700 px-4 py-2 rounded-lg flex items-center justify-center w-full"
                        whileHover={{
                          scale: 1.03,
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                        }}
                      >
                        Learn more
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </MotionButton>
                    </div>
                  </motion.div>

                  {/* API Testing Card */}
                  <motion.div
                    className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  >
                    <div className="rounded-2xl bg-gradient-to-r from-green-500 to-green-600 w-14 h-14 flex items-center justify-center mb-6 shadow-md">
                      <Braces className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800">API Testing</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Testing backend services and APIs using Postman, REST Assured, and custom scripts.
                    </p>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <MotionButton
                        className="text-sm font-medium bg-green-50 text-green-700 px-4 py-2 rounded-lg flex items-center justify-center w-full"
                        whileHover={{
                          scale: 1.03,
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                        }}
                      >
                        Learn more
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </MotionButton>
                    </div>
                  </motion.div>
                </div>
              </ScrollReveal>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default TestingPlayground;
