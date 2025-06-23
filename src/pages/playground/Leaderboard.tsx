import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Medal,
  Award,
  Star,
  CheckCircle,
  Search,
  Filter,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/auth-utils';
import { LeaderboardEntry } from '../../types/playground';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMediaQuery } from '@/lib';

// Mock leaderboard data
const mockLeaderboardData: LeaderboardEntry[] = [
  {
    userId: '1',
    username: 'testmaster',
    displayName: 'Test Master',
    avatar: 'https://i.pravatar.cc/150?img=1',
    points: 5200,
    level: 8,
    challengesCompleted: 42,
    rank: 1,
    badges: ['expert', 'api_master', 'bug_hunter', 'performance_guru']
  },
  {
    userId: '2',
    username: 'debugqueen',
    displayName: 'Debug Queen',
    avatar: 'https://i.pravatar.cc/150?img=5',
    points: 4800,
    level: 7,
    challengesCompleted: 38,
    rank: 2,
    badges: ['expert', 'security_sentinel', 'bug_hunter']
  },
  {
    userId: '3',
    username: 'codehunter',
    displayName: 'Code Hunter',
    avatar: 'https://i.pravatar.cc/150?img=3',
    points: 4500,
    level: 7,
    challengesCompleted: 35,
    rank: 3,
    badges: ['advanced', 'api_master', 'mobile_explorer']
  },
  {
    userId: '4',
    username: 'bugsquasher',
    displayName: 'Bug Squasher',
    avatar: 'https://i.pravatar.cc/150?img=4',
    points: 3900,
    level: 6,
    challengesCompleted: 31,
    rank: 4,
    badges: ['advanced', 'bug_hunter', 'accessibility_advocate']
  },
  {
    userId: '5',
    username: 'testguru',
    displayName: 'Test Guru',
    avatar: 'https://i.pravatar.cc/150?img=6',
    points: 3600,
    level: 6,
    challengesCompleted: 29,
    rank: 5,
    badges: ['advanced', 'performance_guru']
  },
  {
    userId: '6',
    username: 'qamaster',
    displayName: 'QA Master',
    avatar: 'https://i.pravatar.cc/150?img=7',
    points: 3200,
    level: 5,
    challengesCompleted: 26,
    rank: 6,
    badges: ['intermediate', 'ui_specialist']
  },
  {
    userId: '7',
    username: 'testuser',
    displayName: 'Test User',
    avatar: 'https://i.pravatar.cc/150?img=2',
    points: 450,
    level: 3,
    challengesCompleted: 12,
    rank: 7,
    badges: ['beginner', 'bug_hunter']
  }
];

// Badge info
const badgeInfo: Record<string, { label: string, color: string, icon: React.ElementType }> = {
  'beginner': { label: 'Beginner', color: 'bg-green-100 text-green-800', icon: Star },
  'intermediate': { label: 'Intermediate', color: 'bg-blue-100 text-blue-800', icon: Star },
  'advanced': { label: 'Advanced', color: 'bg-purple-100 text-purple-800', icon: Star },
  'expert': { label: 'Expert', color: 'bg-yellow-100 text-yellow-800', icon: Star },
  'bug_hunter': { label: 'Bug Hunter', color: 'bg-red-100 text-red-800', icon: Trophy },
  'api_master': { label: 'API Master', color: 'bg-indigo-100 text-indigo-800', icon: Award },
  'security_sentinel': { label: 'Security Sentinel', color: 'bg-slate-100 text-slate-800', icon: Medal },
  'performance_guru': { label: 'Performance Guru', color: 'bg-amber-100 text-amber-800', icon: Award },
  'mobile_explorer': { label: 'Mobile Explorer', color: 'bg-teal-100 text-teal-800', icon: Trophy },
  'accessibility_advocate': { label: 'Accessibility Advocate', color: 'bg-lime-100 text-lime-800', icon: Medal },
  'ui_specialist': { label: 'UI Specialist', color: 'bg-pink-100 text-pink-800', icon: Trophy }
};

type SortField = 'rank' | 'points' | 'level' | 'challengesCompleted';
type SortDirection = 'asc' | 'desc';

const Leaderboard = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('global');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(mockLeaderboardData);

  // Find current user in leaderboard
  const currentUserRank = user
    ? leaderboardData.findIndex(entry => entry.userId === user.id) + 1
    : -1;

  // Filter and sort leaderboard data
  const filteredData = leaderboardData.filter(entry =>
    entry.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case 'rank':
        comparison = a.rank - b.rank;
        break;
      case 'points':
        comparison = b.points - a.points;
        break;
      case 'level':
        comparison = b.level - a.level;
        break;
      case 'challengesCompleted':
        comparison = b.challengesCompleted - a.challengesCompleted;
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Handle sort change
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending for rank, descending for others
      setSortField(field);
      setSortDirection(field === 'rank' ? 'asc' : 'desc');
    }
  };

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    }

    return sortDirection === 'asc'
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="relative">
      <main className="container py-6 pt-24 relative z-10" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}>
        {/* Hero Section */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={`${isMobile ? 'p-4' : 'p-8'} bg-gradient-to-r from-blue-500/10 via-teal-500/10 to-purple-500/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg`}>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <motion.h1 
                  className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Leaderboard
                </motion.h1>
                <motion.p 
                  className={`text-gray-700 mb-4 ${isMobile ? 'text-sm' : 'text-base'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  See how you rank against other testers in the community. Compete in challenges and climb the leaderboard!
                </motion.p>
                
                {/* Current User Rank */}
                {user && currentUserRank > 0 && (
                  <motion.div 
                    className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/50"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-teal-100 p-2 rounded-full">
                        <Trophy className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Your Current Rank</p>
                        <p className="text-xl font-bold text-teal-600">#{currentUserRank}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              {!isMobile && (
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="w-32 h-32 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center shadow-lg">
                    <Trophy className="w-16 h-16 text-yellow-600" />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Search and Filter Section */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/50">
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} gap-4 mb-4`}>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/70 border"
                />
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
                  <TabsTrigger value="global" className={isMobile ? 'text-xs' : 'text-sm'}>Global</TabsTrigger>
                  <TabsTrigger value="weekly" className={isMobile ? 'text-xs' : 'text-sm'}>Weekly</TabsTrigger>
                  <TabsTrigger value="monthly" className={isMobile ? 'text-xs' : 'text-sm'}>Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Sort Controls - Mobile Optimized */}
            {isMobile ? (
              <div className="w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full bg-white/70 border hover:bg-white/90 justify-between">
                      <span>Sort by: {sortField === 'rank' ? 'Rank' : sortField === 'points' ? 'Points' : sortField === 'level' ? 'Level' : 'Challenges'}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleSort('rank')}>
                      Rank {getSortIcon('rank')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort('points')}>
                      Points {getSortIcon('points')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort('level')}>
                      Level {getSortIcon('level')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort('challengesCompleted')}>
                      Challenges {getSortIcon('challengesCompleted')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort('rank')}
                  className="bg-white/70 border hover:bg-white/90"
                >
                  Rank {getSortIcon('rank')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort('points')}
                  className="bg-white/70 border hover:bg-white/90"
                >
                  Points {getSortIcon('points')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort('level')}
                  className="bg-white/70 border hover:bg-white/90"
                >
                  Level {getSortIcon('level')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort('challengesCompleted')}
                  className="bg-white/70 border hover:bg-white/90"
                >
                  Challenges {getSortIcon('challengesCompleted')}
                </Button>
              </div>
            )}
          </div>
        </motion.section>

        {/* Leaderboard */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-white/50 overflow-hidden">
            <div className="space-y-0">
              {sortedData.map((entry, index) => (
                <motion.div
                  key={entry.userId}
                  className={`${isMobile ? 'p-3' : 'p-4'} border-b border-gray-100 last:border-b-0 hover:bg-white/60 transition-colors ${
                    user && entry.userId === user.id ? 'bg-teal-50/50 border-teal-200' : ''
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={!prefersReducedMotion ? { scale: 1.01 } : {}}
                >
                  {isMobile ? (
                    // Mobile Layout - Stacked
                    <div className="space-y-3">
                      {/* Top Row: Rank + Avatar + Name */}
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 text-center">
                          {entry.rank <= 3 ? (
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto ${
                              entry.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                              entry.rank === 2 ? 'bg-gray-100 text-gray-600' :
                              'bg-orange-100 text-orange-600'
                            }`}>
                              {entry.rank === 1 ? <Trophy className="w-3 h-3" /> :
                               entry.rank === 2 ? <Medal className="w-3 h-3" /> :
                               <Award className="w-3 h-3" />}
                            </div>
                          ) : (
                            <span className="text-sm font-bold text-gray-600">#{entry.rank}</span>
                          )}
                        </div>

                        <Avatar className="w-8 h-8">
                          <AvatarImage src={entry.avatar} alt={entry.displayName} />
                          <AvatarFallback className="text-xs">{entry.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-800 truncate text-sm">{entry.displayName}</p>
                          <p className="text-xs text-gray-500 truncate">@{entry.username}</p>
                        </div>
                      </div>

                      {/* Bottom Row: Stats + Badges */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs">
                          <div className="text-center">
                            <p className="font-bold text-teal-600">{entry.points.toLocaleString()}</p>
                            <p className="text-gray-500">Points</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-blue-600">Lv.{entry.level}</p>
                            <p className="text-gray-500">{entry.challengesCompleted} done</p>
                          </div>
                        </div>

                        {/* Mobile Badges - Compact */}
                        <div className="flex flex-wrap gap-1 max-w-24">
                          {entry.badges.slice(0, 2).map((badge) => {
                            const badgeData = badgeInfo[badge];
                            if (!badgeData) return null;
                            const IconComponent = badgeData.icon;
                            return (
                              <Badge
                                key={badge}
                                variant="secondary"
                                className={`text-xs p-1 ${badgeData.color} border-0`}
                              >
                                <IconComponent className="w-2 h-2" />
                              </Badge>
                            );
                          })}
                          {entry.badges.length > 2 && (
                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 p-1">
                              +{entry.badges.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Desktop Layout - Horizontal
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-12 text-center">
                        {entry.rank <= 3 ? (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                            entry.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                            entry.rank === 2 ? 'bg-gray-100 text-gray-600' :
                            'bg-orange-100 text-orange-600'
                          }`}>
                            {entry.rank === 1 ? <Trophy className="w-4 h-4" /> :
                             entry.rank === 2 ? <Medal className="w-4 h-4" /> :
                             <Award className="w-4 h-4" />}
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-gray-600">#{entry.rank}</span>
                        )}
                      </div>

                      {/* Avatar and Name */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={entry.avatar} alt={entry.displayName} />
                          <AvatarFallback>{entry.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-800 truncate">{entry.displayName}</p>
                          <p className="text-sm text-gray-500 truncate">@{entry.username}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-bold text-teal-600">{entry.points.toLocaleString()}</p>
                          <p className="text-gray-500">Points</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-blue-600">Level {entry.level}</p>
                          <p className="text-gray-500">{entry.challengesCompleted} Challenges</p>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1 max-w-32">
                        {entry.badges.slice(0, 3).map((badge) => {
                          const badgeData = badgeInfo[badge];
                          if (!badgeData) return null;
                          const IconComponent = badgeData.icon;
                          return (
                            <Badge
                              key={badge}
                              variant="secondary"
                              className={`text-xs ${badgeData.color} border-0`}
                            >
                              <IconComponent className="w-3 h-3 mr-1" />
                              {badgeData.label}
                            </Badge>
                          );
                        })}
                        {entry.badges.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                            +{entry.badges.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {sortedData.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No users found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery('')}
                  className="bg-white/70 border hover:bg-white/90"
                >
                  Clear Search
                </Button>
              </div>
            </motion.div>
          )}
        </motion.section>
      </main>
    </div>
  );
};

export default Leaderboard;
