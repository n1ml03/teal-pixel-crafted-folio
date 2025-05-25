import { useState } from 'react';
import {
  Bug,
  X,
  Camera,
  Save,
  AlertCircle,
  Info} from 'lucide-react';
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
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useIsMobile } from '@/hooks/use-mobile';

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

  const handleChange = (field: keyof BugReport, value: string) => {
    setBugReport(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!bugReport.title || !bugReport.description || !bugReport.steps) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Add screenshot if available
    const reportWithScreenshot = {
      ...bugReport,
      screenshotUrl
    };

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

    toast.success("Bug report submitted successfully");
    onOpenChange(false);
  };

  const severityIcons = {
    low: <Info className="h-4 w-4 text-blue-500" />,
    medium: <AlertCircle className="h-4 w-4 text-yellow-500" />,
    high: <AlertCircle className="h-4 w-4 text-orange-500" />,
    critical: <AlertCircle className="h-4 w-4 text-red-500" />
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto p-4 md:p-6">
        <SheetHeader className={isMobile ? 'mb-3' : ''}>
          <SheetTitle className="flex items-center">
            <Bug className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} mr-2`} />
            Report a Bug
          </SheetTitle>
          <SheetDescription className={isMobile ? 'text-xs' : ''}>
            {isMobile ? 'Document the issue with details to help fix it.' : 'Document the issue you\'ve found with detailed information to help developers fix it.'}
          </SheetDescription>
        </SheetHeader>

        <div className={`${isMobile ? 'py-2' : 'py-4'} space-y-3 md:space-y-4`}>
          <div className="space-y-1 md:space-y-2">
            <Label htmlFor="bug-title" className={isMobile ? 'text-sm' : ''}>Bug Title <span className="text-red-500">*</span></Label>
            <Input
              id="bug-title"
              placeholder="Brief description of the issue"
              value={bugReport.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={isMobile ? 'h-8 text-sm' : ''}
              aria-required="true"
              aria-describedby="bug-title-help"
            />
            <div id="bug-title-help" className="sr-only">
              Provide a brief, descriptive title for the bug you're reporting
            </div>
          </div>

          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'}`}>
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="bug-severity" className={isMobile ? 'text-sm' : ''}>Severity <span className="text-red-500">*</span></Label>
              <Select
                value={bugReport.severity}
                onValueChange={(value) => handleChange('severity', value as BugReport['severity'])}
              >
                <SelectTrigger id="bug-severity" className={isMobile ? 'h-8 text-sm' : ''}>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low" className="flex items-center">
                    <div className="flex items-center">
                      {severityIcons.low}
                      <span className="ml-2">Low</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center">
                      {severityIcons.medium}
                      <span className="ml-2">Medium</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center">
                      {severityIcons.high}
                      <span className="ml-2">High</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="critical">
                    <div className="flex items-center">
                      {severityIcons.critical}
                      <span className="ml-2">Critical</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="bug-type" className={isMobile ? 'text-sm' : ''}>Bug Type <span className="text-red-500">*</span></Label>
              <Select
                value={bugReport.type}
                onValueChange={(value) => handleChange('type', value as BugReport['type'])}
              >
                <SelectTrigger id="bug-type" className={isMobile ? 'h-8 text-sm' : ''}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="functional">Functional</SelectItem>
                  <SelectItem value="ui">UI/Visual</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1 md:space-y-2">
            <Label htmlFor="bug-description" className={isMobile ? 'text-sm' : ''}>Description <span className="text-red-500">*</span></Label>
            <Textarea
              id="bug-description"
              placeholder="Detailed description of the bug"
              className={`${isMobile ? 'min-h-[60px] text-sm' : 'min-h-[80px]'}`}
              value={bugReport.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          <div className="space-y-1 md:space-y-2">
            <Label htmlFor="bug-steps" className={isMobile ? 'text-sm' : ''}>Steps to Reproduce <span className="text-red-500">*</span></Label>
            <Textarea
              id="bug-steps"
              placeholder={isMobile ? "1. Go to...\n2. Click on..." : "1. Go to...\n2. Click on...\n3. Observe that..."}
              className={`${isMobile ? 'min-h-[80px] text-sm' : 'min-h-[100px]'}`}
              value={bugReport.steps}
              onChange={(e) => handleChange('steps', e.target.value)}
            />
          </div>

          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'}`}>
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="expected-result" className={isMobile ? 'text-sm' : ''}>Expected Result</Label>
              <Textarea
                id="expected-result"
                placeholder="What should happen"
                className={`${isMobile ? 'min-h-[60px] text-sm' : 'min-h-[80px]'}`}
                value={bugReport.expectedResult}
                onChange={(e) => handleChange('expectedResult', e.target.value)}
              />
            </div>

            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="actual-result" className={isMobile ? 'text-sm' : ''}>Actual Result</Label>
              <Textarea
                id="actual-result"
                placeholder="What actually happened"
                className={`${isMobile ? 'min-h-[60px] text-sm' : 'min-h-[80px]'}`}
                value={bugReport.actualResult}
                onChange={(e) => handleChange('actualResult', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1 md:space-y-2">
            <Label className={isMobile ? 'text-sm' : ''}>Screenshot</Label>
            {screenshotUrl ? (
              <div className="relative border rounded-md overflow-hidden">
                <img
                  src={screenshotUrl}
                  alt="Bug screenshot"
                  className="w-full h-auto max-h-[200px] object-contain"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className={`absolute top-2 right-2 ${isMobile ? 'h-6 w-6' : 'h-8 w-8'} rounded-full`}
                  onClick={() => onTakeScreenshot()}
                >
                  <X className={isMobile ? 'h-3 w-3' : 'h-4 w-4'} />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                size={isMobile ? "sm" : "default"}
                onClick={onTakeScreenshot}
              >
                <Camera className={`${isMobile ? 'h-3.5 w-3.5 mr-1.5' : 'h-4 w-4 mr-2'}`} />
                Take Screenshot
              </Button>
            )}
          </div>
        </div>

        <SheetFooter className={isMobile ? 'flex-col space-y-2' : ''}>
          <SheetClose asChild>
            <Button variant="outline" size={isMobile ? "sm" : "default"}>Cancel</Button>
          </SheetClose>
          <Button onClick={handleSubmit} size={isMobile ? "sm" : "default"}>
            <Save className={`${isMobile ? 'h-3.5 w-3.5 mr-1.5' : 'h-4 w-4 mr-2'}`} />
            {isMobile ? "Submit" : "Submit Bug Report"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default BugReportingTool;
