import { motion } from 'framer-motion';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import CodeReviewTool from '@/components/tools/CodeReviewTool';
import { Code, ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CodeReviewToolPage = () => {
  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Enhanced Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2320b2aa' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
        {/* Floating elements */}
        <motion.div 
          className="absolute top-20 right-20 w-32 h-32 rounded-full bg-purple-400/5 blur-xl"
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-indigo-400/5 blur-xl"
          animate={{ y: [0, 20, 0], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <Header />

      {/* Header Section - Full width but with container for content */}
      <div className="relative z-10 pt-24 pb-6 bg-white/40 backdrop-blur-sm border-b border/50 shrink-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm hover:bg-white shrink-0 border-gray-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              
              <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shrink-0 shadow-lg">
                  <Code className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 truncate">Code Review Simulator</h1>
                  <p className="text-base sm:text-lg text-gray-600 hidden sm:block mt-1">Advanced code analysis tool with automated review suggestions</p>
                </div>
              </div>
            </div>

          </motion.div>
          
          {/* Mobile description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base text-gray-600 mt-4 sm:hidden"
          >
            Advanced code analysis tool with automated review suggestions and best practices
          </motion.p>
        </div>
      </div>

      {/* Tool Content - Full height expansion */}
      <motion.main 
        className="relative z-0 flex-1 w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="h-full w-full">
          <CodeReviewTool />
        </div>
      </motion.main>

      <Footer />
    </div>
  );
};

export default CodeReviewToolPage; 