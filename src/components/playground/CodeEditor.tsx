import { useRef, useEffect, useState, useCallback, memo } from 'react';
import { EditorView, lineNumbers, highlightActiveLineGutter, highlightSpecialChars,
  drawSelection, dropCursor, rectangularSelection, crosshairCursor,
  keymap, highlightActiveLine as highlightActiveLineExtension } from '@codemirror/view';
import { EditorState, Compartment, Extension } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { autocompletion, CompletionContext, CompletionResult, completionKeymap } from '@codemirror/autocomplete';
import { indentUnit, foldGutter, foldKeymap } from '@codemirror/language';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Copy, 
  Check, 
  Code, 
  Save, 
  Maximize2, 
  Minimize2, 
  RefreshCw,
  Sparkles,
  Zap,
  Terminal,
  FileCode,
  Rocket
} from 'lucide-react';
import { toast } from 'sonner';
import { throttle } from '@/lib/scroll-optimization';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

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

// Language configuration with enhanced metadata
const languageConfig = {
  javascript: {
    name: 'JavaScript',
    icon: FileCode,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800'
  },
  typescript: {
    name: 'TypeScript',
    icon: Code,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  html: {
    name: 'HTML',
    icon: FileCode,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800'
  },
  css: {
    name: 'CSS',
    icon: Sparkles,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800'
  },
  json: {
    name: 'JSON',
    icon: FileCode,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  python: {
    name: 'Python',
    icon: Code,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
    borderColor: 'border-indigo-200 dark:border-indigo-800'
  },
  markdown: {
    name: 'Markdown',
    icon: FileCode,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-900/20',
    borderColor: 'border dark:border-gray-800'
  }
};

// Dynamic language loading with caching
const languageExtensionCache = new Map<CodeLanguage, Extension>();

const getLanguageExtension = async (lang: CodeLanguage) => {
  if (languageExtensionCache.has(lang)) {
    return languageExtensionCache.get(lang);
  }

  let extension: Extension;
  try {
    switch (lang) {
      case 'javascript': {
        const { javascript } = await import('@codemirror/lang-javascript');
        extension = javascript();
        break;
      }
      case 'typescript': {
        const { javascript: jsWithTs } = await import('@codemirror/lang-javascript');
        extension = jsWithTs({ typescript: true });
        break;
      }
      case 'html': {
        const { html } = await import('@codemirror/lang-html');
        extension = html();
        break;
      }
      case 'css': {
        const { css } = await import('@codemirror/lang-css');
        extension = css();
        break;
      }
      case 'json': {
        const { json } = await import('@codemirror/lang-json');
        extension = json();
        break;
      }
      case 'python': {
        const { python } = await import('@codemirror/lang-python');
        extension = python();
        break;
      }
      case 'markdown': {
        const { markdown } = await import('@codemirror/lang-markdown');
        extension = markdown();
        break;
      }
      default: {
        const { javascript: defaultJs } = await import('@codemirror/lang-javascript');
        extension = defaultJs();
      }
    }
    
    languageExtensionCache.set(lang, extension);
    return extension;
  } catch (error) {
    console.error(`Failed to load language extension for ${lang}:`, error);
    // Fallback to basic javascript extension
    const { javascript } = await import('@codemirror/lang-javascript');
    const fallback = javascript();
    languageExtensionCache.set(lang, fallback);
    return fallback;
  }
};

// Enhanced custom autocompletion with better categorization
const testingAutocompletion = (context: CompletionContext): CompletionResult | null => {
  const word = context.matchBefore(/\w*/);
  if (!word || (word.from === word.to && !context.explicit)) return null;

  const testingTerms = [
    // Testing framework terms
    { label: 'accessibility', type: 'keyword', info: 'Testing for accessibility compliance', detail: 'a11y testing' },
    { label: 'assert', type: 'function', info: 'Assert that a condition is true', detail: 'assertion method' },
    { label: 'describe', type: 'function', info: 'Describe a test suite', detail: 'test suite' },
    { label: 'expect', type: 'function', info: 'Expect a value to match certain criteria', detail: 'expectation' },
    { label: 'performance', type: 'keyword', info: 'Testing for performance metrics', detail: 'perf testing' },
    { label: 'responsive', type: 'keyword', info: 'Testing for responsive design', detail: 'responsive test' },
    { label: 'security', type: 'keyword', info: 'Testing for security vulnerabilities', detail: 'security audit' },
    { label: 'test', type: 'function', info: 'Define a test case', detail: 'test case' },
    { label: 'usability', type: 'keyword', info: 'Testing for usability issues', detail: 'UX testing' },

    // DOM manipulation
    { label: 'querySelector', type: 'method', info: 'Select elements using CSS selectors', detail: 'DOM query' },
    { label: 'querySelectorAll', type: 'method', info: 'Select all elements matching CSS selectors', detail: 'DOM query all' },
    { label: 'getElementById', type: 'method', info: 'Get element by its ID', detail: 'DOM by ID' },
    { label: 'getElementsByClassName', type: 'method', info: 'Get elements by class name', detail: 'DOM by class' },
    { label: 'getElementsByTagName', type: 'method', info: 'Get elements by tag name', detail: 'DOM by tag' },
    { label: 'createElement', type: 'method', info: 'Create a new element', detail: 'DOM creation' },
    { label: 'appendChild', type: 'method', info: 'Append a child element', detail: 'DOM manipulation' },
    { label: 'removeChild', type: 'method', info: 'Remove a child element', detail: 'DOM manipulation' },
    { label: 'addEventListener', type: 'method', info: 'Add an event listener to an element', detail: 'event handling' },
    { label: 'removeEventListener', type: 'method', info: 'Remove an event listener from an element', detail: 'event handling' },

    // Browser APIs
    { label: 'setTimeout', type: 'function', info: 'Execute code after a delay', detail: 'async timing' },
    { label: 'setInterval', type: 'function', info: 'Execute code repeatedly at intervals', detail: 'async timing' },
    { label: 'clearTimeout', type: 'function', info: 'Cancel a timeout', detail: 'async timing' },
    { label: 'clearInterval', type: 'function', info: 'Cancel an interval', detail: 'async timing' },
    { label: 'console.log', type: 'method', info: 'Log messages to the console', detail: 'debugging' },
    { label: 'console.error', type: 'method', info: 'Log error messages to the console', detail: 'debugging' },
    { label: 'console.warn', type: 'method', info: 'Log warning messages to the console', detail: 'debugging' },
    { label: 'console.info', type: 'method', info: 'Log informational messages to the console', detail: 'debugging' },
    { label: 'console.table', type: 'method', info: 'Display tabular data in the console', detail: 'debugging' },

    // Global objects
    { label: 'document', type: 'variable', info: 'The document object', detail: 'global DOM' },
    { label: 'window', type: 'variable', info: 'The window object', detail: 'global window' },
    { label: 'navigator', type: 'variable', info: 'The navigator object (browser information)', detail: 'browser info' },
    { label: 'location', type: 'variable', info: 'The location object (current URL)', detail: 'current URL' },
    { label: 'history', type: 'variable', info: 'The history object (browser history)', detail: 'navigation' },

    // Network and storage
    { label: 'fetch', type: 'function', info: 'Fetch resources from the network', detail: 'HTTP requests' },
    { label: 'XMLHttpRequest', type: 'class', info: 'Make HTTP requests', detail: 'legacy HTTP' },
    { label: 'localStorage', type: 'variable', info: 'Local storage API', detail: 'persistent storage' },
    { label: 'sessionStorage', type: 'variable', info: 'Session storage API', detail: 'session storage' },
    { label: 'cookies', type: 'variable', info: 'Document cookies', detail: 'browser cookies' },

    // Testing-specific functions
    { label: 'checkAccessibility', type: 'function', info: 'Check for accessibility issues', detail: 'a11y validation' },
    { label: 'testResponsiveness', type: 'function', info: 'Test responsive design', detail: 'responsive validation' },
    { label: 'validateForm', type: 'function', info: 'Validate form inputs', detail: 'form validation' },
    { label: 'simulateUserInteraction', type: 'function', info: 'Simulate user interactions', detail: 'user simulation' },
    { label: 'checkPerformance', type: 'function', info: 'Check performance metrics', detail: 'performance metrics' }
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
  const [isRunning, setIsRunning] = useState(false);
  const [lastRunTime, setLastRunTime] = useState<number | null>(null);
  const previousValueRef = useRef<string>(value);
  const isMobile = useIsMobile();

  // Get current language config
  const currentLanguageConfig = languageConfig[language];

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

  // Enhanced copy handler with feedback
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error("Failed to copy code");
    }
  };

  // Enhanced run handler with loading state
  const handleRun = async () => {
    if (!onRun || isRunning) return;
    
    setIsRunning(true);
    const startTime = Date.now();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for visual feedback
      onRun(value);
      const runTime = Date.now() - startTime;
      setLastRunTime(runTime);
      toast.success(`Code executed successfully in ${runTime}ms`);
    } catch (error) {
      console.error('Error running code:', error);
      toast.error("Error executing code");
    } finally {
      setIsRunning(false);
    }
  };

  // Enhanced save handler
  const handleSave = () => {
    if (onSave) {
      onSave(value);
      toast.success("Code saved successfully!");
    }
  };

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorRef.current) return;

    const initializeEditor = async () => {
      // Load language extension asynchronously
      const languageExtension = await getLanguageExtension(language);

      // Create extensions array
      const extensions: Extension[] = [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        drawSelection(),
        dropCursor(),
        rectangularSelection(),
        crosshairCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentUnit.of("  "),
        EditorView.lineWrapping,
        languageCompartment.of(languageExtension),
        themeCompartment.of(theme === 'dark' ? oneDark : [])
      ];

      // Add optional extensions
      if (showLineNumbers) {
        extensions.push(lineNumbers());
      }

      if (showFoldGutter) {
        extensions.push(foldGutter());
      }

      if (highlightActiveLine) {
        extensions.push(highlightActiveLineExtension());
      }

      if (enableAutocompletion) {
        extensions.push(
          autocompletion({
            override: [testingAutocompletion]
          })
        );
      }

      // Custom styling
      extensions.push(
        EditorView.theme({
          '&': {
            fontSize: fontSize,
            fontFamily: fontFamily
          },
          '.cm-content': {
            padding: '16px',
            lineHeight: lineHeight,
            minHeight: height
          },
          '.cm-focused': {
            outline: 'none'
          },
          '.cm-editor': {
            borderRadius: '8px'
          },
          '.cm-scroller': {
            fontFamily: fontFamily
          }
        })
      );

      // Add change listener
      extensions.push(
        EditorView.updateListener.of(update => {
          if (update.docChanged && !readOnly) {
            const newValue = update.state.doc.toString();
            if (newValue !== previousValueRef.current) {
              previousValueRef.current = newValue;
              throttledOnChange(newValue);
            }
          }
        })
      );

      // Create editor state
      const state = EditorState.create({
        doc: value,
        extensions
      });

      // Create editor view
      const view = new EditorView({
        state,
        parent: editorRef.current
      });

      editorViewRef.current = view;
    };

    initializeEditor();

    // Cleanup function
    return () => {
      if (editorViewRef.current) {
        editorViewRef.current.destroy();
        editorViewRef.current = null;
      }
    };
  }, [
    language,
    theme,
    showLineNumbers,
    showFoldGutter,
    highlightActiveLine,
    enableAutocompletion,
    fontSize,
    fontFamily,
    lineHeight,
    height,
    readOnly,
    throttledOnChange,
    value,
    languageCompartment,
    themeCompartment
  ]);

  // Update editor when value changes externally
  useEffect(() => {
    if (editorViewRef.current && value !== previousValueRef.current) {
      const view = editorViewRef.current;
      const currentValue = view.state.doc.toString();
      
      if (currentValue !== value) {
        view.dispatch({
          changes: {
            from: 0,
            to: currentValue.length,
            insert: value
          }
        });
        previousValueRef.current = value;
      }
    }
  }, [value]);

  // Update language when it changes
  useEffect(() => {
    const updateLanguage = async () => {
      if (editorViewRef.current) {
        const languageExtension = await getLanguageExtension(language);
        editorViewRef.current.dispatch({
          effects: languageCompartment.reconfigure(languageExtension)
        });
      }
    };
    
    updateLanguage();
  }, [language, languageCompartment]);

  // Update theme when it changes
  useEffect(() => {
    if (editorViewRef.current) {
      editorViewRef.current.dispatch({
        effects: themeCompartment.reconfigure(theme === 'dark' ? oneDark : [])
      });
    }
  }, [theme, themeCompartment]);

  // Calculate line count
  const lineCount = value.split('\n').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative bg-gradient-to-br from-background via-background to-muted/10 rounded-xl border border/50 overflow-hidden backdrop-blur-sm",
        isFullscreen && "fixed inset-4 z-50 bg-background shadow-2xl",
        className
      )}
      style={{ height: isFullscreen ? 'calc(100vh - 2rem)' : height }}
    >
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-background/90 to-muted/20 border-b border/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-2 rounded-lg border transition-all duration-200",
              currentLanguageConfig.bgColor,
              currentLanguageConfig.borderColor
            )}>
              {(() => {
                const IconComponent = currentLanguageConfig.icon;
                return <IconComponent className={cn("h-4 w-4", currentLanguageConfig.color)} />;
              })()}
            </div>
            <div>
              <Badge 
                className={cn(
                  "font-medium transition-all duration-200",
                  currentLanguageConfig.bgColor,
                  currentLanguageConfig.borderColor,
                  currentLanguageConfig.color
                )}
              >
                {currentLanguageConfig.name}
              </Badge>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                <span>{lineCount} lines</span>
                {lastRunTime && (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    • Last run: {lastRunTime}ms
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {showCopyButton && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="hover:bg-accent/50 transition-all duration-200 hover:scale-105"
                  disabled={!value}
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check className="h-4 w-4 text-emerald-500" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Copy className="h-4 w-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {!isMobile && <span className="ml-2">Copy</span>}
                </Button>
              </motion.div>
            )}

            {showRunButton && onRun && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleRun}
                  disabled={!value || isRunning}
                  className={cn(
                    "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700",
                    "transition-all duration-200 hover:scale-105 shadow-lg shadow-emerald-500/25"
                  )}
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      {!isMobile && "Running..."}
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4 mr-2" />
                      {!isMobile && "Run"}
                    </>
                  )}
                </Button>
              </motion.div>
            )}

            {showSaveButton && onSave && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className="hover:bg-accent/50 transition-all duration-200 hover:scale-105 border/50"
                  disabled={!value}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {!isMobile && "Save"}
                </Button>
              </motion.div>
            )}

            {showFullscreenButton && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="hover:bg-accent/50 transition-all duration-200 hover:scale-105"
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Enhanced Editor Container */}
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={editorRef}
          className={cn(
            "h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
            "focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200",
            readOnly && "opacity-75"
          )}
          style={{ minHeight: height }}
        />
        
        {/* Loading overlay for run action */}
        <AnimatePresence>
          {isRunning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="flex items-center gap-3 bg-background/90 rounded-lg px-4 py-2 border border/50 shadow-lg">
                <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm font-medium">Executing code...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!value && placeholder && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-muted-foreground/50">
              <Terminal className="h-12 w-12 mx-auto mb-3" />
              <p className="text-sm">{placeholder}</p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-muted/30 to-background/50 border-t border/50 text-xs text-muted-foreground backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            Ready
          </span>
          <span>{lineCount} lines</span>
          <span>{value.length} characters</span>
        </div>
        
        <div className="flex items-center gap-4">
          {enableAutocompletion && (
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Smart completion
            </span>
          )}
          <span className="capitalize">{language}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(CodeEditor);
