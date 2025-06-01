import React, { useState, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useAIConfig } from '@/contexts/AIConfigContext';
import AIConfigPanel from './AIConfigPanel';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Brain,
  Settings,
  X,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Zap,
  Shield,
  Rocket,
  Star,
  ChevronUp
} from 'lucide-react';

interface GlobalAIConfigProps {
  className?: string;
}

const FloatingTrigger = memo(({ 
  isConfigured, 
  onClick 
}: { 
  isConfigured: boolean; 
  onClick: () => void; 
}) => {
  const controls = useAnimation();
  
  const handleClick = useCallback(() => {
    controls.start({
      scale: [1, 0.95, 1],
      rotate: [0, 5, 0],
      transition: { duration: 0.3 }
    });
    onClick();
  }, [controls, onClick]);

  const statusColor = useMemo(() => ({
    gradient: isConfigured 
      ? 'from-emerald-400 via-teal-500 to-cyan-600' 
      : 'from-amber-400 via-orange-500 to-red-500',
    shadow: isConfigured 
      ? 'shadow-emerald-500/25' 
      : 'shadow-orange-500/25',
    glow: isConfigured 
      ? 'bg-emerald-500/10' 
      : 'bg-orange-500/10'
  }), [isConfigured]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        scale: 1,
        ...controls
      }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      whileHover={{ 
        scale: 1.05,
        x: -5,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      className="fixed top-1/2 right-0 transform -translate-y-1/2 z-50 group"
      style={{ 
        right: '-2px',
        pointerEvents: 'auto'
      }}
    >
      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-l-2xl ${statusColor.glow} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Main Button */}
      <Button
        onClick={handleClick}
        className={`
          relative rounded-l-2xl rounded-r-none px-4 py-8 
          bg-white/95 backdrop-blur-xl border border-r-0 
          ${statusColor.shadow} shadow-xl hover:shadow-2xl
          border-white/20 hover:bg-white/98
          transition-all duration-500 group-hover:pr-6
          overflow-hidden min-w-[60px]
        `}
        variant="ghost"
      >
        {/* Animated Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${statusColor.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
        
        {/* Content */}
        <div className="relative flex flex-col items-center space-y-3 text-gray-700">
          {/* Icon with Animation */}
          <motion.div
            animate={{ 
              rotate: isConfigured ? [0, 360] : [0, 10, -10, 0],
            }}
            transition={{ 
              duration: isConfigured ? 2 : 1,
              repeat: Infinity,
              repeatDelay: isConfigured ? 3 : 2,
            }}
            className="relative"
          >
            <Brain className="w-6 h-6" />
            {isConfigured && (
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-3 h-3 text-emerald-500" />
              </motion.div>
            )}
          </motion.div>
          
          {/* Vertical Text */}
          <div className="writing-mode-vertical text-xs font-semibold tracking-wider">
            AI CONFIG
          </div>
          
          {/* Status Badge */}
          <motion.div
            animate={{ 
              scale: isConfigured ? [1, 1.1, 1] : 1,
            }}
            transition={{ 
              duration: 2, 
              repeat: isConfigured ? Infinity : 0,
              repeatDelay: 1 
            }}
          >
            <Badge 
              className={`
                text-xs px-2 py-1 font-medium border-0
                ${isConfigured 
                  ? "bg-emerald-100 text-emerald-700 shadow-emerald-500/20" 
                  : "bg-orange-100 text-orange-700 shadow-orange-500/20"
                } shadow-lg
              `}
            >
              {isConfigured ? (
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>Ready</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>Setup</span>
                </div>
              )}
            </Badge>
          </motion.div>
        </div>
        
        {/* Hover Arrow */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ 
            opacity: 0,
            x: 10
          }}
          whileHover={{ 
            opacity: 1,
            x: 0,
            transition: { delay: 0.1 }
          }}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </motion.div>
      </Button>
    </motion.div>
  );
});

const ConfigPanel = memo(({ 
  isMinimized, 
  onToggleMinimized, 
  onClose 
}: { 
  isMinimized: boolean; 
  onToggleMinimized: () => void; 
  onClose: () => void; 
}) => {
  const { isConfigured } = useAIConfig();
  
  const statusConfig = useMemo(() => ({
    gradient: isConfigured 
      ? 'from-emerald-50 via-teal-50 to-cyan-50' 
      : 'from-amber-50 via-orange-50 to-red-50',
    iconGradient: isConfigured
      ? 'from-emerald-500 to-cyan-600'
      : 'from-amber-500 to-orange-600',
    statusText: isConfigured 
      ? 'AI is fully configured and operational' 
      : 'Complete AI setup to unlock full potential'
  }), [isConfigured]);

  return (
    <>
      {/* Backdrop with Blur */}
      <motion.div
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        className="fixed inset-0 bg-black/10 z-40"
        onClick={onClose}
      />

      {/* Main Panel */}
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ 
          type: 'spring', 
          damping: 30, 
          stiffness: 300,
          opacity: { duration: 0.2 }
        }}
        className="fixed top-0 right-0 h-full w-full max-w-lg bg-white/95 backdrop-blur-2xl shadow-2xl z-50 flex flex-col border-l border-white/20"
      >
        {/* Enhanced Header */}
        <div className={`p-6 border-b border-white/10 bg-gradient-to-r ${statusConfig.gradient} relative overflow-hidden`}>
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full transform -translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-white/15 to-transparent rounded-full transform translate-x-12 translate-y-12" />
          </div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Enhanced Icon */}
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity }
                }}
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${statusConfig.iconGradient} flex items-center justify-center shadow-lg`}
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
              
              <div>
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl font-bold text-gray-800 flex items-center space-x-2"
                >
                  <span>AI Configuration</span>
                  {isConfigured && <Rocket className="w-5 h-5 text-emerald-600" />}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-sm text-gray-600 mt-1"
                >
                  {statusConfig.statusText}
                </motion.p>
              </div>
            </div>
            
            {/* Header Controls */}
            <div className="flex items-center space-x-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleMinimized}
                  className="text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-xl"
                >
                  {isMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content Area with Enhanced Animations */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {!isMinimized ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full"
              >
                <div className="p-6 h-full overflow-y-auto custom-scrollbar">
                  <AIConfigPanel 
                    toolCategory="general"
                    className="border-0 shadow-none bg-transparent"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="minimized"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="p-8"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Settings className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Configuration Panel
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Expand to access advanced AI settings and customization options
                  </p>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={onToggleMinimized}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Expand Configuration
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border-t border-white/10 p-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity 
                }}
                className={`w-3 h-3 rounded-full ${isConfigured ? 'bg-emerald-500' : 'bg-orange-500'} shadow-lg`}
              />
              <span className="text-sm font-medium text-gray-700">
                {statusConfig.statusText}
              </span>
              {isConfigured && <Shield className="w-4 h-4 text-emerald-600" />}
            </div>
            
            <Badge 
              className={`
                px-3 py-1 font-semibold text-xs rounded-full shadow-md
                ${isConfigured 
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                  : "bg-orange-100 text-orange-700 border border-orange-200"
                }
              `}
            >
              {isConfigured ? (
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>Operational</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>Setup Required</span>
                </div>
              )}
            </Badge>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
});

const GlobalAIConfig: React.FC<GlobalAIConfigProps> = ({ className = "" }) => {
  const { isConfigured } = useAIConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false); // Auto-expand when opening
  }, []);
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false); // Reset minimized state when closing
  }, []);
  const handleToggleMinimized = useCallback(() => setIsMinimized(prev => !prev), []);

  return (
    <div className={`fixed inset-0 pointer-events-none z-40 ${className}`}>
      {/* Floating Trigger */}
      <div className="pointer-events-auto">
        <AnimatePresence>
          {!isOpen && (
            <FloatingTrigger 
              isConfigured={isConfigured}
              onClick={handleOpen}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Main Panel */}
      <div className="pointer-events-auto">
        <AnimatePresence>
          {isOpen && (
            <ConfigPanel
              isMinimized={isMinimized}
              onToggleMinimized={handleToggleMinimized}
              onClose={handleClose}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Custom Styles */}
      <style>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </div>
  );
};

export default memo(GlobalAIConfig); 