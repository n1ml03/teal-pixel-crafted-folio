import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNavigateWithTransition } from '@/hooks/useNavigateWithTransition';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  TestTube,
  Trophy,
  Menu,
  X,
  Bell,
  Search,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/auth-utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { MotionButton } from "@/components/ui/motion-button";
import { MotionLink } from "@/components/ui/motion-link";

interface NavigationProps {
  className?: string;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  tooltip: string;
  external?: boolean;
}

export const Navigation = ({ className }: NavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navigateWithTransition = useNavigateWithTransition();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState<{id: string, text: string, read: boolean}[]>([
    { id: '1', text: 'New challenge available!', read: false },
    { id: '2', text: 'You earned a new badge', read: false }
  ]);

  // Track scroll position for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string, external?: boolean) => {
    if (external) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(`/playground${path}`);
  };

  const navItems: NavItem[] = [
    {
      path: '/',
      label: 'Home',
      icon: <Home className="h-4 w-4 mr-1" />,
      tooltip: 'View portfolio website',
      external: true
    },
    {
      path: '/challenges',
      label: 'Challenges',
      icon: <TestTube className="h-4 w-4 mr-1" />,
      tooltip: 'Browse and attempt testing challenges'
    },
    {
      path: '/leaderboard',
      label: 'Leaderboard',
      icon: <Trophy className="h-4 w-4 mr-1" />,
      tooltip: 'See how you rank against other testers'
    },

  ];

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Toggle search visibility
  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    if (searchVisible) {
      setSearchQuery('');
    }
  };

  // Handle search submission
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to help page with search query
      navigateWithTransition(`/playground/help?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchVisible(false);
      setSearchQuery('');
    }
  };

  // Handle search input key press
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    } else if (e.key === 'Escape') {
      setSearchVisible(false);
      setSearchQuery('');
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      } ${className}`}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        <MotionLink
          href="/playground"
          className="flex items-center gap-2 text-xl font-bold text-gray-900 transition-colors hover:text-teal-500 duration-300 p-0"
          whileHover={{ color: "rgb(20, 184, 166)" }}
        >
          <Sparkles className="w-6 h-6" />
          <span>Testing Playground</span>
        </MotionLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item, index) => (
            <MotionButton
              key={item.path}
              onClick={() => item.external ? navigateWithTransition(item.path) : navigateWithTransition(`/playground${item.path}`)}
              className={cn(
                "flex items-center text-gray-700 hover:text-teal-500 transition-all duration-300 text-sm font-medium",
                isActive(item.path, item.external) ? 'text-teal-500' : ''
              )}
              whileHover={{ y: -2, color: "rgb(20, 184, 166)" }}
              whileTap={{ scale: 0.95 }}
              variant="ghost"
            >
              {item.icon}
              {item.label}
            </MotionButton>
          ))}

          <MotionButton
            className="bg-black hover:bg-gray-800 rounded-full px-5 py-2 text-sm font-medium text-white flex items-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transitionType="spring"
            onClick={() => navigateWithTransition('/playground/help')}
          >
            <MessageSquare className="w-4 h-4 mr-1.5" />
            Get Help
          </MotionButton>
        </nav>

        {/* Action buttons for desktop */}
        <div className="hidden md:flex items-center space-x-2">
          {/* Search button */}
          <AnimatePresence>
            {searchVisible && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mr-2"
              >
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9"
                  autoFocus
                  onKeyDown={handleSearchKeyPress}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSearch}
            aria-label="Search"
            className="h-9 w-9"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <Bell className="h-4 w-4" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between p-2">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              </div>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <DropdownMenuItem key={notification.id} className={cn(
                    "p-3 cursor-pointer",
                    !notification.read && "bg-muted/50"
                  )}>
                    <div className="flex items-start gap-2">
                      <div className={cn(
                        "h-2 w-2 rounded-full mt-1.5",
                        notification.read ? "bg-muted-foreground" : "bg-primary"
                      )} />
                      <div>
                        <p className="text-sm">{notification.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">Just now</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile menu button */}
        <motion.button
          className="md:hidden text-gray-700 bg-white/80 p-2 rounded-full shadow-sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.95)" }}
          whileTap={{ scale: 0.95 }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden bg-white/95 backdrop-blur-md absolute w-full shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            {navItems.map((item) => (
              <MotionButton
                key={item.path}
                onClick={() => {
                  if (item.external) {
                    navigateWithTransition(item.path);
                  } else {
                    navigateWithTransition(`/playground${item.path}`);
                  }
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  "flex items-center text-gray-700 hover:text-teal-500 transition-colors py-2 border-b border-gray-100 px-4 rounded-lg hover:bg-gray-50 w-full justify-start",
                  isActive(item.path, item.external) ? 'text-teal-500 bg-gray-50' : ''
                )}
                whileHover={{ x: 5, backgroundColor: "rgb(249, 250, 251)" }}
                whileTap={{ scale: 0.98 }}
                variant="ghost"
                transitionType="tween"
                transitionDuration={0.2}
              >
                {item.icon}
                {item.label}
              </MotionButton>
            ))}

            {/* Mobile action buttons */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSearch}
                aria-label="Search"
                className="h-9 w-9"
              >
                <Search className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 relative"
                onClick={() => navigateWithTransition('/playground/notifications')}
              >
                <Bell className="h-4 w-4" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                )}
              </Button>

              <MotionButton
                className="bg-black hover:bg-gray-800 rounded-full px-5 py-2 text-white flex items-center"
                onClick={() => {
                  navigateWithTransition('/playground/help');
                  setMobileMenuOpen(false);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transitionType="spring"
              >
                <MessageSquare className="w-4 h-4 mr-1.5" />
                Get Help
              </MotionButton>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navigation;
