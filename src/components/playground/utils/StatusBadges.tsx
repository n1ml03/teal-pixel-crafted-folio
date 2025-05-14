import React from 'react';
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Bug,
  ArrowRight,
  Info
} from 'lucide-react';

// Define the BugReport interface
export interface BugSeverity {
  severity: 'Critical' | 'Major' | 'Minor' | 'Trivial';
}

export interface BugStatus {
  status: 'Open' | 'In Progress' | 'Fixed' | 'Verified' | 'Closed';
}

export interface TestCasePriority {
  priority: 'High' | 'Medium' | 'Low';
}

export interface TestCaseStatus {
  status: 'Passed' | 'Failed' | 'Blocked' | 'Not Run';
}

// Function to render severity badge
export const renderSeverityBadge = (severity: BugSeverity['severity']) => {
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
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">
          <Bug className="h-3 w-3 mr-1" /> Trivial
        </Badge>
      );
    default:
      return null;
  }
};

// Function to render bug status badge
export const renderBugStatusBadge = (status: BugStatus['status']) => {
  switch (status) {
    case 'Open':
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
          <Bug className="h-3 w-3 mr-1" /> Open
        </Badge>
      );
    case 'In Progress':
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200">
          <ArrowRight className="h-3 w-3 mr-1" /> In Progress
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
          <XCircle className="h-3 w-3 mr-1" /> Closed
        </Badge>
      );
    default:
      return null;
  }
};

// Function to render test case priority badge
export const renderPriorityBadge = (priority: TestCasePriority['priority']) => {
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

// Function to render test case status badge
export const renderTestStatusBadge = (status: TestCaseStatus['status']) => {
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
          <AlertTriangle className="h-3 w-3 mr-1" /> Failed
        </Badge>
      );
    case 'Blocked':
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
          <Info className="h-3 w-3 mr-1" /> Blocked
        </Badge>
      );
    case 'Not Run':
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">
          Not Run
        </Badge>
      );
    default:
      return null;
  }
};
