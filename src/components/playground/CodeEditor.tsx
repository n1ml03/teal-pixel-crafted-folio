import { useRef, useEffect, useState, useCallback, memo } from 'react';
import { EditorView, lineNumbers, highlightActiveLineGutter, highlightSpecialChars,
  drawSelection, dropCursor, rectangularSelection, crosshairCursor,
  keymap, highlightActiveLine } from '@codemirror/view';
import { EditorState, Compartment, Extension } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { python } from '@codemirror/lang-python';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { autocompletion, CompletionContext, CompletionResult, completionKeymap } from '@codemirror/autocomplete';
import { lintGutter, linter, Diagnostic } from '@codemirror/lint';
import { indentUnit, syntaxHighlighting, HighlightStyle, foldGutter, foldKeymap } from '@codemirror/language';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { tags } from '@lezer/highlight';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Copy, Check, Code, Play, Save, Maximize2, Minimize2, Download, Upload, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { throttle } from '@/lib/scroll-optimization';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

export type CodeLanguage = 'javascript' | 'typescript' | 'html' | 'css' | 'json' | 'python' | 'markdown';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: CodeLanguage;
  readOnly?: boolean;
  height?: string;
  placeholder?: string;
  className?: string;

  showCopyButton?: boolean;
  showRunButton?: boolean;
  showSaveButton?: boolean;
  showFullscreenButton?: boolean;
  showLineNumbers?: boolean;
  showFoldGutter?: boolean;
  highlightActiveLine?: boolean;
  enableAutocompletion?: boolean;
  enableLinting?: boolean;
  onRun?: (code: string) => void;
  onSave?: (code: string) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  theme?: 'light' | 'dark';
  fontSize?: string;
  lineHeight?: string;
  fontFamily?: string;
  responsive?: boolean;
}

// Get language extension based on selected language
const getLanguageExtension = (lang: CodeLanguage) => {
  switch (lang) {
    case 'javascript':
      return javascript();
    case 'typescript':
      return javascript({ typescript: true });
    case 'html':
      return html();
    case 'css':
      return css();
    case 'json':
      return json();
    case 'python':
      return python();
    case 'markdown':
      return markdown();
    default:
      return javascript();
  }
};

// Custom autocompletion function with common web testing terms
const testingAutocompletion = (context: CompletionContext): CompletionResult | null => {
  const word = context.matchBefore(/\w*/);
  if (!word || (word.from === word.to && !context.explicit)) return null;

  const testingTerms = [
    // Testing framework terms
    { label: 'accessibility', type: 'keyword', info: 'Testing for accessibility compliance' },
    { label: 'assert', type: 'function', info: 'Assert that a condition is true' },
    { label: 'describe', type: 'function', info: 'Describe a test suite' },
    { label: 'expect', type: 'function', info: 'Expect a value to match certain criteria' },
    { label: 'performance', type: 'keyword', info: 'Testing for performance metrics' },
    { label: 'responsive', type: 'keyword', info: 'Testing for responsive design' },
    { label: 'security', type: 'keyword', info: 'Testing for security vulnerabilities' },
    { label: 'test', type: 'function', info: 'Define a test case' },
    { label: 'usability', type: 'keyword', info: 'Testing for usability issues' },

    // DOM manipulation
    { label: 'querySelector', type: 'method', info: 'Select elements using CSS selectors' },
    { label: 'querySelectorAll', type: 'method', info: 'Select all elements matching CSS selectors' },
    { label: 'getElementById', type: 'method', info: 'Get element by its ID' },
    { label: 'getElementsByClassName', type: 'method', info: 'Get elements by class name' },
    { label: 'getElementsByTagName', type: 'method', info: 'Get elements by tag name' },
    { label: 'createElement', type: 'method', info: 'Create a new element' },
    { label: 'appendChild', type: 'method', info: 'Append a child element' },
    { label: 'removeChild', type: 'method', info: 'Remove a child element' },
    { label: 'addEventListener', type: 'method', info: 'Add an event listener to an element' },
    { label: 'removeEventListener', type: 'method', info: 'Remove an event listener from an element' },

    // Browser APIs
    { label: 'setTimeout', type: 'function', info: 'Execute code after a delay' },
    { label: 'setInterval', type: 'function', info: 'Execute code repeatedly at intervals' },
    { label: 'clearTimeout', type: 'function', info: 'Cancel a timeout' },
    { label: 'clearInterval', type: 'function', info: 'Cancel an interval' },
    { label: 'console.log', type: 'method', info: 'Log messages to the console' },
    { label: 'console.error', type: 'method', info: 'Log error messages to the console' },
    { label: 'console.warn', type: 'method', info: 'Log warning messages to the console' },
    { label: 'console.info', type: 'method', info: 'Log informational messages to the console' },
    { label: 'console.table', type: 'method', info: 'Display tabular data in the console' },

    // Global objects
    { label: 'document', type: 'variable', info: 'The document object' },
    { label: 'window', type: 'variable', info: 'The window object' },
    { label: 'navigator', type: 'variable', info: 'The navigator object (browser information)' },
    { label: 'location', type: 'variable', info: 'The location object (current URL)' },
    { label: 'history', type: 'variable', info: 'The history object (browser history)' },

    // Network and storage
    { label: 'fetch', type: 'function', info: 'Fetch resources from the network' },
    { label: 'XMLHttpRequest', type: 'class', info: 'Make HTTP requests' },
    { label: 'localStorage', type: 'variable', info: 'Local storage API' },
    { label: 'sessionStorage', type: 'variable', info: 'Session storage API' },
    { label: 'cookies', type: 'variable', info: 'Document cookies' },

    // Testing-specific functions
    { label: 'checkAccessibility', type: 'function', info: 'Check for accessibility issues' },
    { label: 'testResponsiveness', type: 'function', info: 'Test responsive design' },
    { label: 'validateForm', type: 'function', info: 'Validate form inputs' },
    { label: 'simulateUserInteraction', type: 'function', info: 'Simulate user interactions' },
    { label: 'checkPerformance', type: 'function', info: 'Check performance metrics' }
  ];

  return {
    from: word.from,
    options: testingTerms.filter(term =>
      term.label.toLowerCase().includes(word.text.toLowerCase())
    )
  };
};

export const CodeEditor = ({
  value,
  onChange,
  language = 'javascript',
  readOnly = false,
  height = '300px',
  placeholder = 'Type your code here...',
  className,

  showCopyButton = true,
  showRunButton = false,
  showSaveButton = false,
  showFullscreenButton = false,
  showLineNumbers = true,
  showFoldGutter = true,
  highlightActiveLine = true,
  enableAutocompletion = true,
  enableLinting = true,
  onRun,
  onSave,
  onFullscreenChange,
  theme = 'dark',
  fontSize = '14px',
  lineHeight = '1.5',
  fontFamily = 'monospace',
  responsive = true
}: CodeEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [languageCompartment] = useState(new Compartment());
  const [themeCompartment] = useState(new Compartment());
  const previousValueRef = useRef<string>(value);
  const isMobile = useIsMobile();

  // Create a throttled onChange handler to improve performance
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledOnChange = useCallback(
    throttle((value: string) => {
      if (onChange) {
        onChange(value);
      }
    }, 150),
    [onChange]
  );


  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => {
      const newState = !prev;
      if (onFullscreenChange) {
        onFullscreenChange(newState);
      }
      return newState;
    });
  }, [onFullscreenChange]);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, toggleFullscreen]);

  // Create custom editor setup with configurable features
  const createEditorSetup = useCallback(() => {
    const extensions: Extension[] = [];

    // Line numbers
    if (showLineNumbers) {
      extensions.push(lineNumbers());
    }

    // Active line highlighting and code folding
    if (highlightActiveLine) {
      extensions.push(highlightActiveLineGutter());
    }

    // Code folding
    if (showFoldGutter) {
      extensions.push(foldGutter());
      extensions.push(keymap.of(foldKeymap));
    }

    // Basic editor features
    extensions.push(
      highlightSpecialChars(),
      history(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      indentUnit.of('  '),
      EditorView.lineWrapping,
      keymap.of([...defaultKeymap, ...historyKeymap]),
      EditorState.readOnly.of(readOnly)
    );

    // Autocompletion
    if (enableAutocompletion) {
      extensions.push(autocompletion({
        override: [testingAutocompletion],
        defaultKeymap: true,
        activateOnTyping: true
      }));
    }

    // Linting
    if (enableLinting) {
      extensions.push(lintGutter());
    }

    // Update listener
    extensions.push(
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          const newValue = update.state.doc.toString();
          throttledOnChange(newValue);
        }
      })
    );

    // Placeholder text
    if (placeholder) {
      extensions.push(
        EditorView.contentAttributes.of({
          'data-placeholder': placeholder
        })
      );
    }

    return extensions;
  }, [
    showLineNumbers,
    highlightActiveLine,
    showFoldGutter,
    enableAutocompletion,
    enableLinting,
    readOnly,
    placeholder,
    throttledOnChange
  ]);

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current) return;

    // Create editor view
    const extensions = [
      ...createEditorSetup(),
      languageCompartment.of(getLanguageExtension(language)),
      themeCompartment.of(theme === 'dark' ? oneDark : []),
    ];

    const view = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions
      }),
      parent: editorRef.current
    });

    editorViewRef.current = view;

    return () => {
      view.destroy();
      editorViewRef.current = null;
    };
  // We only want to initialize once, so we're intentionally not including all dependencies
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update editor when language changes
  useEffect(() => {
    if (!editorViewRef.current) return;

    editorViewRef.current.dispatch({
      effects: languageCompartment.reconfigure(getLanguageExtension(language))
    });
  }, [language, languageCompartment]);

  // Update editor when theme changes
  useEffect(() => {
    if (!editorViewRef.current) return;

    editorViewRef.current.dispatch({
      effects: themeCompartment.reconfigure(theme === 'dark' ? oneDark : [])
    });
  }, [theme, themeCompartment]);

  // Update editor content when value prop changes
  useEffect(() => {
    if (!editorViewRef.current) return;

    // Only update if the value has actually changed and is different from what we have
    const currentValue = editorViewRef.current.state.doc.toString();
    if (value !== currentValue && value !== previousValueRef.current) {
      // Store the new value to avoid unnecessary updates
      previousValueRef.current = value;

      // Use a more efficient update approach for large documents
      editorViewRef.current.dispatch({
        changes: {
          from: 0,
          to: currentValue.length,
          insert: value
        }
      });
    }
  }, [value]);

  // Copy code to clipboard
  const handleCopy = async () => {
    if (!editorViewRef.current) return;

    const code = editorViewRef.current.state.doc.toString();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard');

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
      toast.error('Failed to copy code to clipboard');
    }
  };

  // Run code
  const handleRun = () => {
    if (!editorViewRef.current || !onRun) return;

    try {
      const code = editorViewRef.current.state.doc.toString();
      onRun(code);
    } catch (error) {
      console.error('Failed to run code:', error);
      toast.error('Failed to run code');
    }
  };

  // Save code
  const handleSave = () => {
    if (!editorViewRef.current || !onSave) return;

    try {
      const code = editorViewRef.current.state.doc.toString();
      onSave(code);
    } catch (error) {
      console.error('Failed to save code:', error);
      toast.error('Failed to save code');
    }
  };

  return (
    <div
      className={cn(
        "relative border rounded-md overflow-hidden transition-all duration-300",
        isFullscreen && "fixed inset-0 z-50 border-0 rounded-none",
        className
      )}
    >
      <div className="flex items-center justify-between p-2 border-b bg-muted/50">
        <div className="flex items-center overflow-hidden">
          <Code className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium truncate">{language.charAt(0).toUpperCase() + language.slice(1)}</span>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {showRunButton && onRun && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 hover:bg-primary/10"
              onClick={handleRun}
              title="Run code"
            >
              <Play className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <span className="text-xs hidden sm:inline-block truncate">Run</span>
            </Button>
          )}

          {showSaveButton && onSave && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 hover:bg-primary/10"
              onClick={handleSave}
              title="Save code"
            >
              <Save className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <span className="text-xs hidden sm:inline-block truncate">Save</span>
            </Button>
          )}

          {showCopyButton && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 hover:bg-primary/10"
              onClick={handleCopy}
              title="Copy code"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 mr-1 text-green-500 flex-shrink-0" />
              ) : (
                <Copy className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              )}
              <span className="text-xs hidden sm:inline-block truncate">{copied ? 'Copied' : 'Copy'}</span>
            </Button>
          )}

          {showFullscreenButton && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 hover:bg-primary/10"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              )}
              <span className="text-xs hidden sm:inline-block truncate">
                {isFullscreen ? 'Exit' : 'Fullscreen'}
              </span>
            </Button>
          )}
        </div>
      </div>

      <div
        ref={editorRef}
        className={cn(
          "overflow-auto",
          theme === 'dark' ? 'bg-[#282c34]' : 'bg-white',
          "cm-editor-wrapper", // Add custom class for styling
          isFullscreen && "h-[calc(100vh-40px)]" // Adjust height in fullscreen mode
        )}
        style={{
          height: isFullscreen ? 'calc(100vh - 40px)' : height,
          // Add CSS for placeholder and custom styling
          "--placeholder": `"${placeholder}"`,
          "--editor-font-size": fontSize,
          "--editor-line-height": lineHeight,
          "--editor-font-family": fontFamily
        } as React.CSSProperties}
      />

      {/* Add global styles for editor customization */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .cm-editor-wrapper .cm-content:empty::before {
            content: var(--placeholder);
            color: #888;
            pointer-events: none;
          }

          .cm-editor {
            height: 100%;
          }

          .cm-editor .cm-content {
            font-family: var(--editor-font-family, monospace);
            font-size: var(--editor-font-size, 14px);
            line-height: var(--editor-line-height, 1.5);
          }

          .cm-editor .cm-gutters {
            background-color: ${theme === 'dark' ? '#21252b' : '#f5f5f5'};
            border-right: 1px solid ${theme === 'dark' ? '#333' : '#ddd'};
          }

          .cm-editor .cm-activeLineGutter {
            background-color: ${theme === 'dark' ? '#2c313a' : '#e8f2ff'};
          }

          .cm-editor .cm-activeLine {
            background-color: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
          }

          /* Responsive adjustments */
          @media (max-width: 640px) {
            .cm-editor .cm-content {
              font-size: 12px;
            }
          }
        `
      }} />
    </div>
  );
};

export default memo(CodeEditor);
