import React, { useState } from 'react';
import { MotionButton } from "@/components/ui/motion-button";
import { toast } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Copy,
  ExternalLink,
  Maximize2,
  Minimize2,
  Check,
  X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
// @ts-ignore - Ignore type errors for SyntaxHighlighter
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// Import all themes but use them selectively
import {
  oneDark,
  vscDarkPlus,
  atomDark,
  dracula,
  materialDark
} from 'react-syntax-highlighter/dist/esm/styles/prism';

// Define custom types for ReactMarkdown components
type CodeProps = {
  node: any;
  inline: boolean;
  className: string;
  children: React.ReactNode;
  [key: string]: any;
};


interface CodeHighlighterProps {
  code: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
  onOpenDocs?: () => void;
  theme?: 'vscDarkPlus' | 'atomDark' | 'dracula' | 'materialDark' | 'oneDark';
}

const CodeHighlighter: React.FC<CodeHighlighterProps> = ({
  code,
  language,
  title,
  showLineNumbers = true,
  maxHeight = '400px',
  onOpenDocs,
  theme = 'oneDark'
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [isLoadingTheme, setIsLoadingTheme] = useState(false);

  // Function to get the syntax highlighting theme
  const getTheme = () => {
    switch (currentTheme) {
      case 'vscDarkPlus':
        return vscDarkPlus;
      case 'atomDark':
        return atomDark;
      case 'dracula':
        return dracula;
      case 'materialDark':
        return materialDark;
    }
  };

  // Function to copy code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard!');

    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Function to toggle expanded state
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Function to cycle through themes
  const cycleTheme = () => {
    const themes: CodeHighlighterProps['theme'][] = ['vscDarkPlus', 'atomDark', 'dracula', 'materialDark', 'oneDark'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];

    setIsLoadingTheme(true);
    setCurrentTheme(nextTheme);

    // Simulate theme loading
    setTimeout(() => {
      setIsLoadingTheme(false);
      toast.success(`Theme changed to ${nextTheme}`);
    }, 300);
  };

  // Function to get language-specific header color
  const getLanguageColor = () => {
    switch (language.toLowerCase()) {
      case 'javascript':
        return 'from-yellow-500 to-yellow-600';
      case 'typescript':
        return 'from-blue-500 to-blue-600';
      case 'python':
        return 'from-green-500 to-green-600';
      case 'java':
        return 'from-orange-500 to-orange-600';
      case 'csharp':
      case 'c#':
        return 'from-purple-500 to-purple-600';
      case 'html':
        return 'from-red-500 to-red-600';
      case 'css':
        return 'from-blue-400 to-blue-500';
      case 'jsx':
      case 'tsx':
        return 'from-cyan-500 to-cyan-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // Function to get language display name
  const getLanguageDisplayName = () => {
    switch (language.toLowerCase()) {
      case 'javascript':
        return 'JavaScript';
      case 'typescript':
        return 'TypeScript';
      case 'python':
        return 'Python';
      case 'java':
        return 'Java';
      case 'csharp':
      case 'c#':
        return 'C#';
      case 'html':
        return 'HTML';
      case 'css':
        return 'CSS';
      case 'jsx':
        return 'JSX';
      case 'tsx':
        return 'TSX';
      default:
        return language;
    }
  };

  return (
    <div className={`rounded-lg overflow-hidden shadow-md border border-gray-200 ${expanded ? 'fixed inset-4 z-50 flex flex-col' : ''}`}>
      {/* Code header with language badge and actions */}
      <div className={`bg-gradient-to-r ${getLanguageColor()} text-white p-3 flex justify-between items-center`}>
        <div className="flex items-center">
          <span className="font-medium">{title || getLanguageDisplayName()}</span>
        </div>
        <div className="flex space-x-2">
          {onOpenDocs && (
            <MotionButton
              size="sm"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={onOpenDocs}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Docs
            </MotionButton>
          )}

          <MotionButton
            size="sm"
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={cycleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="h-3.5 w-3.5 mr-1 flex items-center justify-center">🎨</span>
            Theme
          </MotionButton>

          <MotionButton
            size="sm"
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={copyToClipboard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 mr-1" />
                Copy
              </>
            )}
          </MotionButton>

          <MotionButton
            size="sm"
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={toggleExpanded}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {expanded ? (
              <>
                <Minimize2 className="h-3.5 w-3.5 mr-1" />
                Minimize
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5 mr-1" />
                Expand
              </>
            )}
          </MotionButton>

          {expanded && (
            <MotionButton
              size="sm"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={toggleExpanded}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="h-3.5 w-3.5" />
            </MotionButton>
          )}
        </div>
      </div>

      {/* Code content with syntax highlighting */}
      <div
        className={`overflow-auto ${expanded ? 'flex-grow' : ''}`}
        style={{ maxHeight: expanded ? 'none' : maxHeight }}
      >
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }: CodeProps) {
              const match = /language-(\w+)/.exec(className || '');
              const lang = match ? match[1] : language;

              return !inline ? (
                isLoadingTheme ? (
                  <div className="bg-gray-900 p-4 animate-pulse">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <SyntaxHighlighter
                    style={getTheme()}
                    language={lang}
                    showLineNumbers={showLineNumbers}
                    wrapLines={true}
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      backgroundColor: 'transparent'
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                )
              ) : (
                <code className="bg-gray-800 text-gray-200 px-1 py-0.5 rounded text-sm" {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {`\`\`\`${language}\n${code}\n\`\`\``}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default CodeHighlighter;
