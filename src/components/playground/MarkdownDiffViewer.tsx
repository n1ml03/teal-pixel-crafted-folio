import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MotionButton } from "@/components/ui/motion-button";
import { toast } from "@/components/ui/sonner";
import {
  Copy,
  Maximize2,
  Minimize2,
  Check,
  X,
  ArrowLeftRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark,
  vscDarkPlus,
  atomDark,
  dracula,
  materialDark
} from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownDiffViewerProps {
  beforeCode: string;
  afterCode: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
  initialViewMode?: 'unified' | 'split';
  theme?: 'vscDarkPlus' | 'atomDark' | 'dracula' | 'materialDark' | 'oneDark';
}

const MarkdownDiffViewer: React.FC<MarkdownDiffViewerProps> = ({
  beforeCode,
  afterCode,
  language,
  title = "Code Comparison",
  showLineNumbers = true,
  maxHeight = '400px',
  initialViewMode = 'unified',
  theme = 'oneDark'
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'unified' | 'split'>(initialViewMode);
  const [currentTheme, setCurrentTheme] = useState(theme);

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
      case 'oneDark':
      default:
        return oneDark;
    }
  };

  // Function to copy code to clipboard
  const copyToClipboard = () => {
    const textToCopy = `Before:\n${beforeCode}\n\nAfter:\n${afterCode}`;
    navigator.clipboard.writeText(textToCopy);
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

  // Function to toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === 'unified' ? 'split' : 'unified');
  };

  // Function to cycle through themes
  const cycleTheme = () => {
    const themes: MarkdownDiffViewerProps['theme'][] = ['vscDarkPlus', 'atomDark', 'dracula', 'materialDark', 'oneDark'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];

    setCurrentTheme(nextTheme);
    toast.success(`Theme changed to ${nextTheme}`);
  };

  return (
    <div className={`rounded-lg overflow-hidden shadow-md border border-gray-200 ${expanded ? 'fixed inset-4 z-50 flex flex-col' : ''}`}>
      {/* Code header with title and actions */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-3 flex justify-between items-center">
        <div className="flex items-center">
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex space-x-2">
          <MotionButton
            size="sm"
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={toggleViewMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeftRight className="h-3.5 w-3.5 mr-1" />
            {viewMode === 'unified' ? 'Split View' : 'Unified View'}
          </MotionButton>

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
        {viewMode === 'unified' ? (
          <div className="bg-gray-900">
            <div className="p-4 border-b border-gray-800">
              <div className="text-red-400 font-medium mb-2">Before:</div>
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    return !inline ? (
                      isLoadingTheme ? (
                        <div className="bg-gray-900 p-4 animate-pulse">
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      ) : (
                        <SyntaxHighlighter
                          style={themeStyle}
                          language={language}
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
                {`\`\`\`${language}\n${beforeCode}\n\`\`\``}
              </ReactMarkdown>
            </div>

            <div className="p-4">
              <div className="text-green-400 font-medium mb-2">After:</div>
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    return !inline ? (
                      <SyntaxHighlighter
                        style={getTheme()}
                        language={language}
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
                    ) : (
                      <code className="bg-gray-800 text-gray-200 px-1 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {`\`\`\`${language}\n${afterCode}\n\`\`\``}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-x divide-gray-700">
            <div className="bg-gray-900 p-4">
              <div className="text-red-400 font-medium mb-2">Before:</div>
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    return !inline ? (
                      <SyntaxHighlighter
                        style={getTheme()}
                        language={language}
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
                    ) : (
                      <code className="bg-gray-800 text-gray-200 px-1 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {`\`\`\`${language}\n${beforeCode}\n\`\`\``}
              </ReactMarkdown>
            </div>

            <div className="bg-gray-900 p-4">
              <div className="text-green-400 font-medium mb-2">After:</div>
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    return !inline ? (
                      <SyntaxHighlighter
                        style={getTheme()}
                        language={language}
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
                    ) : (
                      <code className="bg-gray-800 text-gray-200 px-1 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {`\`\`\`${language}\n${afterCode}\n\`\`\``}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownDiffViewer;
