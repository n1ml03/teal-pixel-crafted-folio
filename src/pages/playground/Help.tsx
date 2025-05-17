import { useState } from 'react';
import {
  Search,
  Book,
  Code,
  Bug,
  FileQuestion,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from '@/components/playground/Navigation';
import EnhancedBackground from '@/components/utils/EnhancedBackground';
import { useNavigate } from 'react-router-dom';
import { helpContent, faqs } from '../../data/help-content';

const Help = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('getting-started');

  // Filter help content based on search query
  const filteredContent = searchQuery.trim() === ''
    ? helpContent
    : helpContent.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery.trim() === ''
    ? faqs
    : faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );



  return (
    <div className="min-h-screen relative">
      {/* Enhanced background with gradient and animated elements */}
      <EnhancedBackground optimizeForLowPerformance={false} />

      {/* Navigation */}
      <Navigation />

      <div className="container flex-1 py-6 pt-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-100">
              <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
              <p className="text-muted-foreground">
                Find answers to common questions and learn how to use the Testing Playground effectively.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for help topics..."
                className="pl-10 bg-white/90 backdrop-blur-sm border border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4 bg-white/80 backdrop-blur-sm">
                <TabsTrigger value="getting-started">
                  <Book className="h-4 w-4 mr-2" />
                  Getting Started
                </TabsTrigger>
                <TabsTrigger value="testing-environment">
                  <Code className="h-4 w-4 mr-2" />
                  Testing Environment
                </TabsTrigger>
                <TabsTrigger value="bug-reporting">
                  <Bug className="h-4 w-4 mr-2" />
                  Bug Reporting
                </TabsTrigger>
                <TabsTrigger value="faq">
                  <FileQuestion className="h-4 w-4 mr-2" />
                  FAQ
                </TabsTrigger>
              </TabsList>

              {/* Getting Started Content */}
              <TabsContent value="getting-started">
                <Card className="bg-card/95 backdrop-blur-sm border border-gray-100">
                  <CardHeader>
                    <CardTitle>Getting Started with Testing Playground</CardTitle>
                    <CardDescription>
                      Learn the basics of using the Testing Playground platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px] pr-4">
                      {filteredContent
                        .filter(item => item.category === 'getting-started')
                        .map((item, index) => (
                          <div key={index} className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                            <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.content }} />
                          </div>
                        ))}
                    </ScrollArea>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" onClick={() => navigate('/playground/tutorials')}>
                      View Step-by-Step Tutorials
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Testing Environment Content */}
              <TabsContent value="testing-environment">
                <Card className="bg-card/95 backdrop-blur-sm border border-gray-100">
                  <CardHeader>
                    <CardTitle>Using the Testing Environment</CardTitle>
                    <CardDescription>
                      Learn how to use the testing environment effectively
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px] pr-4">
                      {filteredContent
                        .filter(item => item.category === 'testing-environment')
                        .map((item, index) => (
                          <div key={index} className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                            <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.content }} />
                          </div>
                        ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Bug Reporting Content */}
              <TabsContent value="bug-reporting">
                <Card className="bg-card/95 backdrop-blur-sm border border-gray-100">
                  <CardHeader>
                    <CardTitle>Bug Reporting Guide</CardTitle>
                    <CardDescription>
                      Learn how to effectively report bugs and issues
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px] pr-4">
                      {filteredContent
                        .filter(item => item.category === 'bug-reporting')
                        .map((item, index) => (
                          <div key={index} className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                            <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.content }} />
                          </div>
                        ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* FAQ Content */}
              <TabsContent value="faq">
                <Card className="bg-card/95 backdrop-blur-sm border border-gray-100">
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>
                      Find answers to common questions about the Testing Playground
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px] pr-4">
                      <Accordion type="single" collapsible className="w-full">
                        {filteredFaqs.map((faq, index) => (
                          <AccordionItem key={index} value={`faq-${index}`}>
                            <AccordionTrigger className="text-left">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-6">
            {/* Quick Links */}
            <Card className="bg-card/95 backdrop-blur-sm border border-gray-100">
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/playground/tutorials')}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Tutorials
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/playground/sandbox')}>
                  <Code className="mr-2 h-4 w-4" />
                  Sandbox Environment
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/playground/challenges')}>
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Challenges
                </Button>
              </CardContent>
            </Card>

            {/* External Resources */}
            <Card className="bg-card/95 backdrop-blur-sm border border-gray-100">
              <CardHeader>
                <CardTitle className="text-lg">External Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:underline"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  MDN: DOM Documentation
                </a>
                <a
                  href="https://jestjs.io/docs/getting-started"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:underline"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Jest Testing Framework
                </a>
                <a
                  href="https://www.w3.org/WAI/fundamentals/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:underline"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Web Accessibility Fundamentals
                </a>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="bg-card/95 backdrop-blur-sm border border-gray-100">
              <CardHeader>
                <CardTitle className="text-lg">Need More Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <Button className="w-full mt-2" variant="default">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
