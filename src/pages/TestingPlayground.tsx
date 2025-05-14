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
  CheckCircle2,
  Wrench,
  Braces,
  Play,
  ListChecks,
  FileText
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load heavy components - optimized for better performance
const IntegratedTestingEnvironment = lazy(() => import('@/components/playground/IntegratedTestingEnvironment'));

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
        {/* Enhanced background for consistent styling across all sections */}
        <EnhancedBackground optimizeForLowPerformance={true} />

        <main id="main-content" className="pt-24 pb-16">
          {/* Hero Section*/}
          <section id="hero" className="relative py-24 overflow-hidden">
            {/* Consistent animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-20 right-10 w-72 h-72 rounded-full bg-teal-100/30 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                  x: [0, -30, 0],
                  y: [0, 30, 0]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.div
                className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-blue-100/30 blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2],
                  x: [0, 40, 0],
                  y: [0, -40, 0]
                }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 2
                }}
              />
            </div>
            <div className="container mx-auto px-4 relative z-10">
              <ScrollReveal>
                <div className="text-center max-w-4xl mx-auto">
                  <Badge
                    variant="secondary"
                    className="mb-4 bg-teal-50 text-teal-700 hover:bg-teal-100 px-4 py-1.5 text-sm font-medium item-center"
                  >
                    <TestTube className="w-4 h-4 mr-2 text-teal-500" />
                    TESTING PLAYGROUND
                  </Badge>

                  <motion.h1
                    className="text-5xl md:text-5xl font-bold mb-6 leading-tight"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500">
                      Real-time Testing Playground
                    </span>
                  </motion.h1>

                  <motion.p
                    className="text-lg text-gray-600 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Experience how a QA engineer thinks and works. Run tests, create test cases, and learn about testing methodologies.
                  </motion.p>

                  {/* Feature badges */}
                  <motion.div
                    className="flex flex-wrap justify-center gap-4 mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {[
                      { icon: <Bug className="w-4 h-4" />, text: "Bug Fixing" },
                      { icon: <CheckCircle2 className="w-4 h-4" />, text: "Test Case Writing" },
                      { icon: <Code className="w-4 h-4" />, text: "Automation Testing" }
                    ].map((item, index) => (
                      <Badge
                        key={index}
                        className="bg-white/80 text-gray-700 border-gray-200 py-2 px-4 flex items-center shadow-sm transition-all duration-200 border hover:bg-gray-50"
                      >
                        <span className="text-teal-500 mr-2">{item.icon}</span>
                        <span className="text-sm font-medium">{item.text}</span>
                      </Badge>
                    ))}
                  </motion.div>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Interactive Application Section */}
          <section id="demo-app" className="py-20 relative overflow-hidden">
            {/* Consistent animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-20 left-10 w-64 h-64 rounded-full bg-teal-100/30 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                  x: [0, 30, 0],
                  y: [0, -30, 0]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.div
                className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-blue-100/30 blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2],
                  x: [0, -40, 0],
                  y: [0, 40, 0]
                }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 2
                }}
              />
            </div>

            <div className="container px-4 mx-auto relative z-10">
              <div className="max-w-7xl mx-auto">
                <ScrollReveal className="flex flex-col">
                  <motion.div
                    className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-visible"
                    whileHover={{
                      y: -5,
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)"
                    }}
                  >
                    {/* Feature highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                      <motion.div
                        className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-xl border border-teal-100"
                        whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                      >
                        <div className="flex items-center mb-2">
                          <div className="bg-white p-2 rounded-full shadow-sm mr-3">
                            <CheckCircle2 className="h-5 w-5 text-teal-500" />
                          </div>
                          <h3 className="font-medium text-teal-800">Task Management</h3>
                        </div>
                        <p className="text-sm text-teal-700">
                          Add, complete, and delete tasks with visual feedback
                        </p>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100"
                        whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                      >
                        <div className="flex items-center mb-2">
                          <div className="bg-white p-2 rounded-full shadow-sm mr-3">
                            <Sparkles className="h-5 w-5 text-blue-500" />
                          </div>
                          <h3 className="font-medium text-blue-800">Filtering</h3>
                        </div>
                        <p className="text-sm text-blue-700">
                          Filter tasks by status: All, Active, or Completed
                        </p>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100"
                        whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                      >
                        <div className="flex items-center mb-2">
                          <div className="bg-white p-2 rounded-full shadow-sm mr-3">
                            <Bug className="h-5 w-5 text-purple-500" />
                          </div>
                          <h3 className="font-medium text-purple-800">Bug-Free</h3>
                        </div>
                        <p className="text-sm text-purple-700">
                          All previous bugs have been fixed for a smooth experience
                        </p>
                      </motion.div>
                    </div>

                    {/* Integrated Testing Environment */}
                    <div className="transform transition-all duration-300 mb-16 rounded-xl overflow-visible w-full py-4">
                      <Suspense fallback={
                        <div className="flex flex-col space-y-3 p-6 bg-gray-50/50 animate-pulse w-full">
                          <Skeleton className="h-12 w-full rounded-lg" />
                          <Skeleton className="h-32 w-full rounded-lg" />
                          <Skeleton className="h-8 w-1/3 rounded-lg" />
                          <div className="flex justify-between">
                            <Skeleton className="h-6 w-24 rounded-lg" />
                            <div className="flex space-x-2">
                              <Skeleton className="h-6 w-16 rounded-lg" />
                              <Skeleton className="h-6 w-16 rounded-lg" />
                              <Skeleton className="h-6 w-16 rounded-lg" />
                            </div>
                          </div>
                        </div>
                      }>
                        <IntegratedTestingEnvironment />
                      </Suspense>
                    </div>

                    {/* Instructions and status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                      <motion.div
                        className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl p-6"
                        whileHover={{
                          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
                          scale: 1.02
                        }}
                      >
                        <div className="flex items-start">
                          <div className="bg-white p-2 rounded-full shadow-sm mr-3 flex-shrink-0">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-green-800 mb-1">Status</h3>
                            <p className="text-green-700 text-sm">
                              All bugs in this application have been fixed! Check the "Fixed Bugs" tab in the QA Artifacts panel to see what was fixed.
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6"
                        whileHover={{
                          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
                          scale: 1.02
                        }}
                      >
                        <div className="flex items-start">
                          <div className="bg-white p-2 rounded-full shadow-sm mr-3 flex-shrink-0">
                            <Wrench className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-blue-800 mb-1">How to Use</h3>
                            <p className="text-blue-700 text-sm">
                              Type a task and press Enter or click Add. Click the circle to mark as complete. Use the filter buttons to view different task states.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              </div>
            </div>
          </section>

          {/* QA Artifacts Section - Modernized and Enhanced */}
          <section id="qa-artifacts" className="py-20 relative overflow-hidden">
            {/* Consistent animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-40 right-10 w-72 h-72 rounded-full bg-blue-100/30 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2],
                  x: [0, -30, 0],
                  y: [0, 30, 0]
                }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.div
                className="absolute bottom-40 left-10 w-64 h-64 rounded-full bg-teal-100/30 blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.5, 0.3],
                  x: [0, 40, 0],
                  y: [0, -40, 0]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 2
                }}
              />
            </div>

            <div className="container px-4 mx-auto relative z-10">
              <ScrollReveal>
                <div className="text-center max-w-4xl mx-auto mb-12">
                  <Badge
                    variant="secondary"
                    className="mb-4 bg-teal-50 text-teal-700 hover:bg-teal-100 px-6 py-1.5 text-sm font-medium item-center"
                  >
                    <TestTube className="w-4 h-4 mr-2 text-teal-500" />
                    TESTING PLAYGROUND
                  </Badge>

                  <h2 className="text-4xl font-bold mb-5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                    QA Artifacts
                  </h2>

                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Explore comprehensive testing documentation including test cases, bug reports,
                    automation scripts, and interactive testing tools. Learn how QA engineers ensure software quality.
                  </p>
                </div>
              </ScrollReveal>

              {/* Category navigation cards */}
              <div className="max-w-5xl mx-auto mb-10">
                <ScrollReveal>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 shadow-sm"
                      whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    >
                      <div className="flex items-center mb-3">
                        <div className="bg-white p-2 rounded-full shadow-sm mr-3">
                          <ListChecks className="h-5 w-5 text-blue-500" />
                        </div>
                        <h3 className="font-medium text-blue-800">Documentation</h3>
                      </div>
                      <p className="text-sm text-blue-700 mb-2">
                        Explore test cases and bug reports that document the testing process
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className="bg-blue-100/80 text-blue-700 border-blue-200">Test Cases</Badge>
                        <Badge className="bg-red-100/80 text-red-700 border-red-200">Bug Reports</Badge>
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100 shadow-sm"
                      whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    >
                      <div className="flex items-center mb-3">
                        <div className="bg-white p-2 rounded-full shadow-sm mr-3">
                          <Code className="h-5 w-5 text-purple-500" />
                        </div>
                        <h3 className="font-medium text-purple-800">Automation</h3>
                      </div>
                      <p className="text-sm text-purple-700 mb-2">
                        View automation scripts and run tests to verify application functionality
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className="bg-purple-100/80 text-purple-700 border-purple-200">Automation Scripts</Badge>
                        <Badge className="bg-green-100/80 text-green-700 border-green-200">Test Runner</Badge>
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-gradient-to-br from-teal-50 to-green-50 p-5 rounded-xl border border-teal-100 shadow-sm"
                      whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    >
                      <div className="flex items-center mb-3">
                        <div className="bg-white p-2 rounded-full shadow-sm mr-3">
                          <FileText className="h-5 w-5 text-teal-500" />
                        </div>
                        <h3 className="font-medium text-teal-800">Tools</h3>
                      </div>
                      <p className="text-sm text-teal-700 mb-2">
                        Interactive tools to create test cases, compare bug fixes, and generate reports
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className="bg-teal-100/80 text-teal-700 border-teal-200">Test Builder</Badge>
                        <Badge className="bg-amber-100/80 text-amber-700 border-amber-200">Bug Comparison</Badge>
                      </div>
                    </motion.div>
                  </div>
                </ScrollReveal>
              </div>

              <div className="max-w-7xl mx-auto">
                <ScrollReveal className="flex flex-col">
                  <motion.div
                    className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-visible"
                    whileHover={{
                      y: -5,
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)"
                    }}
                  >
                    {/* QA Artifacts Info */}
                    <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 mb-8">
                      <div className="flex items-start">
                        <div className="bg-white p-2 rounded-full shadow-sm mr-3 flex-shrink-0">
                          <Sparkles className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-blue-800 mb-1">Integrated Testing Environment</h3>
                          <p className="text-blue-700 text-sm">
                            The Interactive Application and QA Artifacts sections have been integrated into a comprehensive testing environment.
                            This allows you to test the application directly while using the QA tools to document and track your testing activities.
                            Try running tests, creating test cases, tracking bugs, and generating reports - all while interacting with the application.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-5"
                        whileHover={{
                          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
                          scale: 1.02
                        }}
                      >
                        <div className="flex items-start">
                          <div className="bg-white p-2 rounded-full shadow-sm mr-3 flex-shrink-0">
                            <Play className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-purple-800 mb-1">Test Runner</h3>
                            <p className="text-purple-700 text-sm">
                              Run automated tests against the interactive application to verify its functionality.
                              View detailed test results and generate test reports.
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-xl p-5"
                        whileHover={{
                          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
                          scale: 1.02
                        }}
                      >
                        <div className="flex items-start">
                          <div className="bg-white p-2 rounded-full shadow-sm mr-3 flex-shrink-0">
                            <ListChecks className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-blue-800 mb-1">Test Builder</h3>
                            <p className="text-blue-700 text-sm">
                              Create custom test scenarios for the interactive application.
                              Define test steps and expected results, then run your scenarios.
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-5"
                        whileHover={{
                          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
                          scale: 1.02
                        }}
                      >
                        <div className="flex items-start">
                          <div className="bg-white p-2 rounded-full shadow-sm mr-3 flex-shrink-0">
                            <Bug className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-red-800 mb-1">Bug Tracker</h3>
                            <p className="text-red-700 text-sm">
                              Document and track bugs discovered during testing.
                              Manage bug status from discovery to resolution.
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5"
                        whileHover={{
                          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
                          scale: 1.02
                        }}
                      >
                        <div className="flex items-start">
                          <div className="bg-white p-2 rounded-full shadow-sm mr-3 flex-shrink-0">
                            <FileText className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-amber-800 mb-1">Report Generator</h3>
                            <p className="text-amber-700 text-sm">
                              Generate comprehensive test reports that summarize your testing activities.
                              Include test results, bug reports, and metrics.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default TestingPlayground;
