import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { BugReport } from '@/data/testing-playground';
import { 
  Bug, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Separator } from "@/components/ui/separator";

interface BugReportsPanelProps {
  bugReports: BugReport[];
}

const BugReportsPanel: React.FC<BugReportsPanelProps> = ({ bugReports }) => {
  // Function to render severity badge with appropriate color and icon
  const renderSeverityBadge = (severity: BugReport['severity']) => {
    switch (severity) {
      case 'Critical':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" /> Critical
          </Badge>
        );
      case 'Major':
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Major
          </Badge>
        );
      case 'Minor':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">
            <Bug className="h-3 w-3 mr-1" /> Minor
          </Badge>
        );
      case 'Trivial':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
            <Bug className="h-3 w-3 mr-1" /> Trivial
          </Badge>
        );
      default:
        return null;
    }
  };

  // Function to render status badge
  const renderStatusBadge = (status: BugReport['status']) => {
    switch (status) {
      case 'Open':
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200">
            Open
          </Badge>
        );
      case 'Fixed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Fixed
          </Badge>
        );
      case 'Verified':
        return (
          <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200 border-teal-200">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
          </Badge>
        );
      case 'Closed':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">
            Closed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <Bug className="h-5 w-5 mr-2 text-teal-600" />
        <h2 className="text-xl font-bold text-gray-800">Bug Reports</h2>
      </div>
      
      {bugReports.map((bugReport, index) => (
        <ScrollReveal key={bugReport.id} delay={index * 0.1} threshold={0.1}>
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm font-mono mr-2">{bugReport.id}</span>
                  <CardTitle className="text-lg">{bugReport.title}</CardTitle>
                </div>
                <div className="flex gap-2">
                  {renderSeverityBadge(bugReport.severity)}
                  {renderStatusBadge(bugReport.status)}
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>Reported: {bugReport.reportedDate}</span>
                <Badge variant="outline" className="ml-3 text-xs">
                  {bugReport.affectedArea}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Steps to Reproduce:</h4>
                  <ol className="list-decimal pl-6 space-y-1">
                    {bugReport.stepsToReproduce.map((step, stepIndex) => (
                      <li key={stepIndex} className="text-gray-600">{step}</li>
                    ))}
                  </ol>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Expected Result:</h4>
                    <div className="flex items-start pl-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 mr-1 flex-shrink-0" />
                      <p className="text-gray-600">{bugReport.expectedResult}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Actual Result:</h4>
                    <div className="flex items-start pl-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 mr-1 flex-shrink-0" />
                      <p className="text-gray-600">{bugReport.actualResult}</p>
                    </div>
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

export default BugReportsPanel;
