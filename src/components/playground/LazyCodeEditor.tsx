import { lazy, Suspense, memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Lazy load the CodeEditor component
const CodeEditor = lazy(() => import('./CodeEditor').then(module => ({ default: module.CodeEditor })));

// Loading skeleton for CodeEditor
const CodeEditorSkeleton = ({ height = '300px', className }: { height?: string; className?: string }) => (
  <div className={cn("w-full border rounded-lg overflow-hidden", className)} style={{ height }}>
    <div className="h-12 bg-muted border-b flex items-center px-4 gap-2">
      <Skeleton className="h-6 w-20" />
      <div className="flex-1" />
      <Skeleton className="h-8 w-8" />
      <Skeleton className="h-8 w-8" />
    </div>
    <div className="p-4 space-y-2" style={{ height: `calc(${height} - 3rem)` }}>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-3/5" />
    </div>
  </div>
);

export interface LazyCodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: 'javascript' | 'typescript' | 'html' | 'css' | 'json' | 'python' | 'markdown';
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

export const LazyCodeEditor = memo(({ height = '300px', className, ...props }: LazyCodeEditorProps) => {
  return (
    <Suspense fallback={<CodeEditorSkeleton height={height} className={className} />}>
      <CodeEditor {...props} height={height} className={className} />
    </Suspense>
  );
});

LazyCodeEditor.displayName = 'LazyCodeEditor'; 