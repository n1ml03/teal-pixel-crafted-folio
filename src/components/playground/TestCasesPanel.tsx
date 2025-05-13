import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { TestCase } from '@/data/testing-playground';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock,
  ListChecks,
  ArrowRight
} from 'lucide-react';

interface TestCasesPanelProps {
  testCases: TestCase[];
}

const TestCasesPanel: React.FC<TestCasesPanelProps> = ({ testCases }) => {
  // Function to render status badge with appropriate color and icon
  const renderStatusBadge = (status: TestCase['status']) => {
    switch (status) {
      case 'Passed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Passed
          </Badge>
        );
      case 'Failed':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">
            <XCircle className="h-3 w-3 mr-1" /> Failed
          </Badge>
        );
      case 'Blocked':
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Blocked
          </Badge>
        );
      case 'Not Run':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">
            <Clock className="h-3 w-3 mr-1" /> Not Run
          </Badge>
        );
      default:
        return null;
    }
  };

  // Function to render priority badge
  const renderPriorityBadge = (priority: TestCase['priority']) => {
    switch (priority) {
      case 'High':
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200">
            P1 - High
          </Badge>
        );
      case 'Medium':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
            P2 - Medium
          </Badge>
        );
      case 'Low':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">
            P3 - Low
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <ListChecks className="h-5 w-5 mr-2 text-teal-600" />
        <h2 className="text-xl font-bold text-gray-800">Test Cases</h2>
      </div>
      
      {testCases.map((testCase, index) => (
        <ScrollReveal key={testCase.id} delay={index * 0.1} threshold={0.1}>
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm font-mono mr-2">{testCase.id}</span>
                  <CardTitle className="text-lg">{testCase.title}</CardTitle>
                </div>
                <div className="flex gap-2">
                  {renderPriorityBadge(testCase.priority)}
                  {renderStatusBadge(testCase.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Preconditions:</h4>
                  <p className="text-gray-600 pl-4">{testCase.preconditions}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Steps:</h4>
                  <ol className="list-decimal pl-6 space-y-1">
                    {testCase.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="text-gray-600">{step}</li>
                    ))}
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Expected Result:</h4>
                  <div className="flex items-start pl-4">
                    <ArrowRight className="h-4 w-4 text-teal-500 mt-0.5 mr-1 flex-shrink-0" />
                    <p className="text-gray-600">{testCase.expectedResult}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      ))}
    </div>
  );
};

export default TestCasesPanel;
