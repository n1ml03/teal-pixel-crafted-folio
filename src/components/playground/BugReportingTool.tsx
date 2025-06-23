import { useState } from 'react';
import {
  Bug,
  Camera,
  AlertCircle,
  Info,
  AlertTriangle,
  XCircle,
  Send,
  CheckCircle2,
  Zap,
  Eye,
  Shield,
  Layers
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BugReportingToolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  screenshotUrl?: string;
  onTakeScreenshot: () => void;
  onSubmit: (bugReport: BugReport) => void;
}

export interface BugReport {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'functional' | 'ui' | 'performance' | 'security' | 'other';
  steps: string;
  expectedResult: string;
  actualResult: string;
  screenshotUrl?: string;
}

// Enhanced severity configuration
const severityConfig = {
  low: {
    icon: Info,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    label: 'Low Priority'
  },
  medium: {
    icon: AlertCircle,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-950/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    label: 'Medium Priority'
  },
  high: {
    icon: AlertTriangle,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-950/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    label: 'High Priority'
  },
  critical: {
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-950/20',
    borderColor: 'border-red-200 dark:border-red-800',
    label: 'Critical'
  }
};

// Enhanced bug type configuration
const bugTypeConfig = {
  functional: {
    icon: Zap,
    color: 'text-emerald-600 dark:text-emerald-400',
    label: 'Functional Issue'
  },
  ui: {
    icon: Eye,
    color: 'text-purple-600 dark:text-purple-400',
    label: 'UI/Visual Issue'
  },
  performance: {
    icon: Zap,
    color: 'text-amber-600 dark:text-amber-400',
    label: 'Performance Issue'
  },
  security: {
    icon: Shield,
    color: 'text-red-600 dark:text-red-400',
    label: 'Security Issue'
  },
  other: {
    icon: Layers,
    color: 'text-gray-600 dark:text-gray-400',
    label: 'Other Issue'
  }
};

export const BugReportingTool = ({
  open,
  onOpenChange,
  screenshotUrl,
  onTakeScreenshot,
  onSubmit
}: BugReportingToolProps) => {
  const isMobile = useIsMobile();
  const [bugReport, setBugReport] = useState<BugReport>({
    title: '',
    description: '',
    severity: 'medium',
    type: 'functional',
    steps: '',
    expectedResult: '',
    actualResult: '',
    screenshotUrl: undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof BugReport, value: string) => {
    setBugReport(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!bugReport.title || !bugReport.description || !bugReport.steps) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Add screenshot if available
      const reportWithScreenshot = {
        ...bugReport,
        screenshotUrl
      };

      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onSubmit(reportWithScreenshot);

      // Reset form and close
      setBugReport({
        title: '',
        description: '',
        severity: 'medium',
        type: 'functional',
        steps: '',
        expectedResult: '',
        actualResult: '',
        screenshotUrl: undefined
      });

      toast.success("Bug report submitted successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting bug report:', error);
      toast.error("Failed to submit bug report");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is valid
  const isFormValid = bugReport.title && bugReport.description && bugReport.steps;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {/* Enhanced Header */}
          <SheetHeader className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                <Bug className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <SheetTitle className="text-xl font-semibold">Report a Bug</SheetTitle>
                <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800 mt-1">
                  Help us improve
                </Badge>
              </div>
            </div>
            <SheetDescription className="text-muted-foreground leading-relaxed">
              Document the issue you've found with detailed information to help our development team fix it quickly.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            {/* Bug Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <Label htmlFor="bug-title" className="text-sm font-medium flex items-center gap-2">
                Bug Title
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bug-title"
                placeholder="Brief description of the issue"
                value={bugReport.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="bg-background/50 border/50 focus:border-red-300 focus:ring-red-200 transition-all duration-200"
                aria-required="true"
              />
            </motion.div>

            {/* Severity and Type Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="space-y-2">
                <Label htmlFor="bug-severity" className="text-sm font-medium">
                  Severity <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={bugReport.severity}
                  onValueChange={(value) => handleChange('severity', value as BugReport['severity'])}
                >
                  <SelectTrigger 
                    id="bug-severity" 
                    className="bg-background/50 border/50 focus:border-red-300"
                  >
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-md border border/50">
                    {Object.entries(severityConfig).map(([key, config]) => {
                      const IconComponent = config.icon;
                      return (
                        <SelectItem key={key} value={key} className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <IconComponent className={cn("h-4 w-4", config.color)} />
                            <span>{config.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bug-type" className="text-sm font-medium">
                  Bug Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={bugReport.type}
                  onValueChange={(value) => handleChange('type', value as BugReport['type'])}
                >
                  <SelectTrigger 
                    id="bug-type" 
                    className="bg-background/50 border/50 focus:border-red-300"
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-md border border/50">
                    {Object.entries(bugTypeConfig).map(([key, config]) => {
                      const IconComponent = config.icon;
                      return (
                        <SelectItem key={key} value={key} className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <IconComponent className={cn("h-4 w-4", config.color)} />
                            <span>{config.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {/* Bug Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="bug-description" className="text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="bug-description"
                placeholder="Detailed description of the bug"
                value={bugReport.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="bg-background/50 border/50 focus:border-red-300 focus:ring-red-200 transition-all duration-200 min-h-[100px] resize-none"
                aria-required="true"
              />
            </motion.div>

            {/* Steps to Reproduce */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="bug-steps" className="text-sm font-medium">
                Steps to Reproduce <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="bug-steps"
                placeholder="1. Go to...&#10;2. Click on...&#10;3. Notice that..."
                value={bugReport.steps}
                onChange={(e) => handleChange('steps', e.target.value)}
                className="bg-background/50 border/50 focus:border-red-300 focus:ring-red-200 transition-all duration-200 min-h-[80px] resize-none"
                aria-required="true"
              />
            </motion.div>

            {/* Expected vs Actual Results */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="space-y-2">
                <Label htmlFor="expected-result" className="text-sm font-medium">
                  Expected Result
                </Label>
                <Textarea
                  id="expected-result"
                  placeholder="What should happen?"
                  value={bugReport.expectedResult}
                  onChange={(e) => handleChange('expectedResult', e.target.value)}
                  className="bg-background/50 border/50 focus:border-green-300 focus:ring-green-200 transition-all duration-200 min-h-[80px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="actual-result" className="text-sm font-medium">
                  Actual Result
                </Label>
                <Textarea
                  id="actual-result"
                  placeholder="What actually happens?"
                  value={bugReport.actualResult}
                  onChange={(e) => handleChange('actualResult', e.target.value)}
                  className="bg-background/50 border/50 focus:border-red-300 focus:ring-red-200 transition-all duration-200 min-h-[80px] resize-none"
                />
              </div>
            </motion.div>

            {/* Screenshot Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <Label className="text-sm font-medium">Screenshot (Optional)</Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onTakeScreenshot}
                  className="border/50 hover:border hover:bg-muted/50 transition-all duration-200"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Take Screenshot
                </Button>
                
                {screenshotUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Screenshot attached
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Form Progress Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-muted/30 to-background/50 rounded-lg p-4 border border/50"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Form Progress</span>
                <Badge 
                  className={cn(
                    "transition-all duration-300",
                    isFormValid 
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800"
                      : "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800"
                  )}
                >
                  {isFormValid ? 'Ready to Submit' : 'Fill Required Fields'}
                </Badge>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col-reverse sm:flex-row gap-3 mt-8 pt-6 border-t border/50"
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border/50 hover:border hover:bg-muted/50 transition-all duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className={cn(
                "flex-1 transition-all duration-300 hover:scale-105",
                isFormValid
                  ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-500/25"
                  : "opacity-50 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Bug Report
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
};

export default BugReportingTool;
