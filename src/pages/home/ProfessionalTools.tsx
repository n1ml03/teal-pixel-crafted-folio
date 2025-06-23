import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import {
  Code,
  Bug,
  TestTube,
  Globe,
  Settings,
  CheckCircle,
  Sparkles,
  ArrowRight,
  FileText,
  Clock,
  Activity,
  BarChart3,
  Layers,
  Shield,
  BookOpen,
  Award,
  Users,
  TrendingUp,
  ExternalLink
} from 'lucide-react';

interface ToolFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'testing' | 'development' | 'analysis' | 'documentation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  features: string[];
  useCases: string[];
  route: string;
}

const tools: ToolFeature[] = [
  {
    id: 'api-tester',
    title: 'API Testing Interface',
    description: 'Professional-grade API testing tool with advanced features for comprehensive endpoint validation',
    icon: <Globe className="w-6 h-6" />,
    category: 'testing',
    difficulty: 'intermediate',
    estimatedTime: '5-15 minutes',
    features: [
      'Multi-method HTTP requests (GET, POST, PUT, DELETE, PATCH)',
      'Authentication support (Bearer Token, API Key, Basic Auth)',
      'Request/Response history and comparison',
      'Environment variables and data templating',
      'Performance metrics and response timing',
      'Automated test assertion builder',
      'Export test results and documentation'
    ],
    useCases: [
      'API endpoint validation during development',
      'Integration testing for third-party services',
      'Performance benchmarking of API responses',
      'Authentication flow testing',
      'Response format validation'
    ],
    route: '/tools/api-tester'
  },
  {
    id: 'test-case-generator',
    title: 'Test Case Generator',
    description: 'AI-powered test case generation from requirements with comprehensive coverage analysis',
    icon: <TestTube className="w-6 h-6" />,
    category: 'testing',
    difficulty: 'beginner',
    estimatedTime: '3-10 minutes',
    features: [
      'Natural language requirement parsing',
      'Comprehensive test scenario generation',
      'Edge case identification and coverage',
      'Test data generation with realistic values',
      'Multiple test formats (BDD, traditional, exploratory)',
      'Priority and risk assessment',
      'Export to popular formats (Excel, JSON, CSV)'
    ],
    useCases: [
      'Quick test planning from user stories',
      'Comprehensive coverage analysis',
      'Edge case discovery and validation',
      'Training and educational purposes',
      'Quality assurance process standardization'
    ],
    route: '/tools/test-case-generator'
  },
  {
    id: 'bug-report-simulator',
    title: 'Bug Report Simulator',
    description: 'Interactive bug reporting tool with guided workflows and best practices',
    icon: <Bug className="w-6 h-6" />,
    category: 'documentation',
    difficulty: 'beginner',
    estimatedTime: '2-8 minutes',
    features: [
      'Guided step-by-step bug reporting workflow',
      'Severity and priority assessment tools',
      'Screenshot and video attachment simulation',
      'Environment information auto-detection',
      'Reproduction steps builder',
      'Impact analysis and stakeholder notification',
      'Integration with popular bug tracking systems'
    ],
    useCases: [
      'Training team members on proper bug reporting',
      'Standardizing bug report quality',
      'Demonstration of QA processes to stakeholders',
      'Educational workshops and tutorials',
      'Process improvement and optimization'
    ],
    route: '/tools/bug-report-simulator'
  },
  {
    id: 'code-review-tool',
    title: 'Code Review Simulator',
    description: 'Advanced code analysis tool with automated review suggestions and best practices',
    icon: <Code className="w-6 h-6" />,
    category: 'development',
    difficulty: 'advanced',
    estimatedTime: '10-30 minutes',
    features: [
      'Multi-language syntax analysis and highlighting',
      'Automated code quality assessment',
      'Security vulnerability detection',
      'Performance optimization suggestions',
      'Code style and convention checking',
      'Technical debt identification',
      'Collaborative review workflow simulation'
    ],
    useCases: [
      'Pre-commit code quality validation',
      'Educational code review training',
      'Security audit and vulnerability assessment',
      'Performance optimization analysis',
      'Technical debt assessment and planning'
    ],
    route: '/tools/code-review-tool'
  }
];

const ProfessionalTools = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = [
    { id: 'all', name: 'All Tools', icon: <Layers className="w-4 h-4" /> },
    { id: 'testing', name: 'Testing', icon: <TestTube className="w-4 h-4" /> },
    { id: 'development', name: 'Development', icon: <Code className="w-4 h-4" /> },
    { id: 'analysis', name: 'Analysis', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'documentation', name: 'Documentation', icon: <FileText className="w-4 h-4" /> }
  ];

  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'testing': return <TestTube className="w-4 h-4" />;
      case 'development': return <Code className="w-4 h-4" />;
      case 'analysis': return <BarChart3 className="w-4 h-4" />;
      case 'documentation': return <FileText className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const handleToolClick = (route: string) => {
    window.location.href = route;
  };

  return (
    <div className="min-h-screen relative">
      {/* Enhanced Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2320b2aa' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <Header />

      <main className="relative z-0 pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", damping: 25 }}
            >
              {/* Floating badge */}
              <motion.div
                className="inline-flex items-center bg-white/90 rounded-full px-6 py-3 mb-6 shadow-lg border border-teal-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Settings className="w-4 h-4 text-teal-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Professional QA Tools</span>
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Advanced Testing{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500 relative">
                  Toolkit
                  <motion.div
                    className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Experience professional-grade QA tools designed for modern development workflows. 
                Test APIs, generate comprehensive test cases, simulate bug reporting, and perform 
                automated code reviews with industry-standard practices.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg">
                    <Activity className="w-4 h-4 mr-2" />
                    Explore Tools
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" 
                  className="border-2 border-teal-200 text-teal-600 hover:bg-teal-50 px-8 py-3 rounded-xl font-semibold"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Documentation
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div 
                className="flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center bg-white/90 px-6 py-3 rounded-full border border-teal-100">
                  <Activity className="w-5 h-5 text-teal-600 mr-2" />
                  <span className="text-gray-700 font-medium">Real-time Testing</span>
                </div>
                <div className="flex items-center bg-white/90 px-6 py-3 rounded-full border border-teal-100">
                  <Shield className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-gray-700 font-medium">Enterprise Security</span>
                </div>
                <div className="flex items-center bg-white/90 px-6 py-3 rounded-full border border-teal-100">
                  <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-gray-700 font-medium">Performance Analytics</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedCategory === category.id 
                    ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-white/90 border hover:border-teal-300 hover:bg-teal-50'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </Button>
            ))}
          </motion.div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 + 0.3 }}
                whileHover={{ y: -2 }}
              >
                <Card className="h-full bg-white/90 border hover:border-teal-300 transition-all duration-200 hover:shadow-lg group overflow-hidden">
                  {/* Card Header with Gradient */}
                  {/* <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-blue-500" /> */}
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white">
                          {tool.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg text-gray-800 group-hover:text-teal-600 transition-colors">
                            {tool.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={`text-xs px-2 py-1 ${getDifficultyColor(tool.difficulty)}`}>
                              {tool.difficulty}
                            </Badge>
                            <div className="flex items-center text-gray-500 text-sm">
                              <Clock className="w-3 h-3 mr-1" />
                              {tool.estimatedTime}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-400">
                        {getCategoryIcon(tool.category)}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                      {tool.description}
                    </CardDescription>
                    
                    {/* Key Features Preview */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <Sparkles className="w-4 h-4 mr-2 text-teal-500" />
                        Key Features
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {tool.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-3 h-3 text-teal-500 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                        {tool.features.length > 3 && (
                          <div className="text-sm text-gray-500 mt-1">
                            +{tool.features.length - 3} more features
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button 
                      onClick={() => handleToolClick(tool.route)}
                      className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Tool
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Benefits Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              Why Choose Our Professional Tools?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Industry Standards</h3>
                <p className="text-sm text-gray-600">Built following industry best practices and professional QA methodologies</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Team Collaboration</h3>
                <p className="text-sm text-gray-600">Designed for team environments with sharing and collaboration features</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Educational Value</h3>
                <p className="text-sm text-gray-600">Perfect for learning and demonstrating professional QA processes</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfessionalTools; 