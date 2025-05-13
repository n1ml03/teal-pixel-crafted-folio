import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AutomationScript } from '@/data/testing-playground';
import {
  Code,
  FileCode
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeHighlighter from './CodeHighlighter';

interface AutomationPanelProps {
  automationScripts: AutomationScript[];
}

const AutomationPanel: React.FC<AutomationPanelProps> = ({ automationScripts }) => {

  // Function to get framework icon/badge
  const getFrameworkBadge = (framework: AutomationScript['framework']) => {
    switch (framework) {
      case 'Cypress':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">
            Cypress
          </Badge>
        );
      case 'Playwright':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
            Playwright
          </Badge>
        );
      case 'Selenium':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
            Selenium
          </Badge>
        );
      case 'Jest':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">
            Jest
          </Badge>
        );
      case 'TestCafe':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">
            TestCafe
          </Badge>
        );
      default:
        return null;
    }
  };

  // Function to get language badge
  const getLanguageBadge = (language: AutomationScript['language']) => {
    switch (language) {
      case 'javascript':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">
            JavaScript
          </Badge>
        );
      case 'typescript':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
            TypeScript
          </Badge>
        );
      case 'java':
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200">
            Java
          </Badge>
        );
      case 'python':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
            Python
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <FileCode className="h-5 w-5 mr-2 text-teal-600" />
        <h2 className="text-xl font-bold text-gray-800">Automation Scripts</h2>
      </div>

      <Tabs defaultValue={automationScripts[0]?.id || ""} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto mb-4">
          {automationScripts.map((script) => (
            <TabsTrigger key={script.id} value={script.id} className="flex items-center">
              <Code className="h-3.5 w-3.5 mr-1.5" />
              {script.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {automationScripts.map((script) => (
          <TabsContent key={script.id} value={script.id} className="mt-0">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{script.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{script.description}</p>
                  </div>
                  <div className="flex gap-2">
                    {getFrameworkBadge(script.framework)}
                    {getLanguageBadge(script.language)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CodeHighlighter
                  code={script.code}
                  language={script.language}
                  title={`${script.framework} - ${script.title}`}
                  onOpenDocs={
                    script.framework === 'Cypress' ?
                    () => window.open('https://docs.cypress.io', '_blank') :
                    script.framework === 'Playwright' ?
                    () => window.open('https://playwright.dev', '_blank') :
                    script.framework === 'Jest' ?
                    () => window.open('https://jestjs.io', '_blank') :
                    undefined
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AutomationPanel;
