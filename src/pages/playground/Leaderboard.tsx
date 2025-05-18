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
  ArrowDown
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
import EnhancedBackground from '@/components/utils/EnhancedBackground';
import { useAuth } from '@/contexts/AuthContext';
import { LeaderboardEntry } from '../../types/playground';
import { useIsMobile } from '@/hooks/use-mobile';

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
    <div className="min-h-screen relative">
      {/* Enhanced background with gradient and animated elements */}
      <EnhancedBackground optimizeForLowPerformance={false} />

      <div className="container py-6 pt-20 md:py-8 md:pt-24 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-2 flex items-center`}>
              <Trophy className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} mr-2 text-yellow-500`} />
              Leaderboard
            </h1>
            <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
              See how you rank against other testers
            </p>
          </div>

          <div className={`flex ${isMobile ? 'flex-col w-full' : 'items-center'} gap-2`}>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="w-full md:w-[200px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className={isMobile ? 'w-full' : ''}>
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isMobile ? "center" : "end"} className={isMobile ? "w-[90vw]" : "w-[200px]"}>
                <DropdownMenuLabel>Filter by Badge</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>All Users</DropdownMenuItem>
                <DropdownMenuItem>Expert</DropdownMenuItem>
                <DropdownMenuItem>Advanced</DropdownMenuItem>
                <DropdownMenuItem>Intermediate</DropdownMenuItem>
                <DropdownMenuItem>Beginner</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Bug Hunters</DropdownMenuItem>
                <DropdownMenuItem>API Masters</DropdownMenuItem>
                <DropdownMenuItem>Security Sentinels</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4 md:mb-6">
          <TabsList className={`${isMobile ? 'w-full' : ''}`}>
            <TabsTrigger value="global" className={`${isMobile ? 'flex-1 text-xs' : ''}`}>Global</TabsTrigger>
            <TabsTrigger value="monthly" className={`${isMobile ? 'flex-1 text-xs' : ''}`}>Monthly</TabsTrigger>
            <TabsTrigger value="weekly" className={`${isMobile ? 'flex-1 text-xs' : ''}`}>Weekly</TabsTrigger>
            <TabsTrigger value="friends" className={`${isMobile ? 'flex-1 text-xs' : ''}`}>Friends</TabsTrigger>
          </TabsList>
        </Tabs>

        {user && currentUserRank > 0 && (
          <div className="mb-4 md:mb-6">
            <div className="rounded-lg border bg-card p-3 md:p-4 shadow-sm">
              <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium mb-3 md:mb-4`}>Your Ranking</h2>
              <div className={`${isMobile ? 'flex flex-col gap-4' : 'flex items-center justify-between'}`}>
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3 md:mr-4">
                    <div className="relative">
                      <Avatar className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} border-2 border-primary`}>
                        <AvatarImage src={user.avatar} alt={user.displayName} />
                        <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full ${isMobile ? 'w-5 h-5 text-[10px]' : 'w-6 h-6 text-xs'} flex items-center justify-center font-bold`}>
                        {currentUserRank}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{user.displayName}</div>
                    <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>@{user.username}</div>
                  </div>
                </div>

                <div className={`flex items-center ${isMobile ? 'justify-between w-full' : 'gap-6'}`}>
                  <div className="text-center">
                    <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>{user.level}</div>
                    <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>Level</div>
                  </div>

                  <div className="text-center">
                    <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>{user.points}</div>
                    <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>Points</div>
                  </div>

                  <div className="text-center">
                    <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>{leaderboardData.find(e => e.userId === user.id)?.challengesCompleted || 0}</div>
                    <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>Challenges</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className={`text-left ${isMobile ? 'p-2' : 'p-4'} font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    <button
                      className="flex items-center"
                      onClick={() => handleSort('rank')}
                    >
                      {isMobile ? '#' : 'Rank'}
                      {getSortIcon('rank')}
                    </button>
                  </th>
                  <th className={`text-left ${isMobile ? 'p-2' : 'p-4'} font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>User</th>
                  <th className={`text-left ${isMobile ? 'p-2' : 'p-4'} font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    <button
                      className="flex items-center"
                      onClick={() => handleSort('level')}
                    >
                      {isMobile ? 'Lvl' : 'Level'}
                      {getSortIcon('level')}
                    </button>
                  </th>
                  <th className={`text-left ${isMobile ? 'p-2' : 'p-4'} font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    <button
                      className="flex items-center"
                      onClick={() => handleSort('points')}
                    >
                      {isMobile ? 'Pts' : 'Points'}
                      {getSortIcon('points')}
                    </button>
                  </th>
                  {!isMobile && (
                    <th className="text-left p-4 font-medium text-sm">
                      <button
                        className="flex items-center"
                        onClick={() => handleSort('challengesCompleted')}
                      >
                        Challenges
                        {getSortIcon('challengesCompleted')}
                      </button>
                    </th>
                  )}
                  {!isMobile && (
                    <th className="text-left p-4 font-medium text-sm">Badges</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((entry, index) => {
                  const isCurrentUser = user && entry.userId === user.id;

                  return (
                    <motion.tr
                      key={entry.userId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`border-b last:border-0 ${isCurrentUser ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
                    >
                      <td className={isMobile ? 'p-2' : 'p-4'}>
                        <div className="flex items-center">
                          {entry.rank <= 3 ? (
                            <div className={`
                              ${isMobile ? 'w-6 h-6 text-xs' : 'w-8 h-8'} rounded-full flex items-center justify-center text-white font-bold
                              ${entry.rank === 1 ? 'bg-yellow-500' :
                                entry.rank === 2 ? 'bg-gray-400' :
                                'bg-amber-700'}
                            `}>
                              {entry.rank}
                            </div>
                          ) : (
                            <div className={`${isMobile ? 'w-6 h-6 text-xs' : 'w-8 h-8'} rounded-full bg-muted flex items-center justify-center font-medium`}>
                              {entry.rank}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className={isMobile ? 'p-2' : 'p-4'}>
                        <div className="flex items-center">
                          <Avatar className={`${isMobile ? 'h-8 w-8 mr-2' : 'h-10 w-10 mr-3'}`}>
                            <AvatarImage src={entry.avatar} alt={entry.displayName} />
                            <AvatarFallback>{entry.displayName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{entry.displayName}</div>
                            <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                              {isMobile ? entry.username.substring(0, 8) + (entry.username.length > 8 ? '...' : '') : '@' + entry.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={isMobile ? 'p-2' : 'p-4'}>
                        <div className="flex items-center">
                          <div className={`bg-primary/10 text-primary rounded-full ${isMobile ? 'w-6 h-6 text-xs' : 'w-8 h-8'} flex items-center justify-center font-bold ${isMobile ? 'mr-1' : 'mr-2'}`}>
                            {entry.level}
                          </div>
                        </div>
                      </td>
                      <td className={`${isMobile ? 'p-2 text-sm' : 'p-4'} font-medium`}>{isMobile ? entry.points : entry.points.toLocaleString()}</td>
                      {!isMobile && (
                        <td className="p-4">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            {entry.challengesCompleted}
                          </div>
                        </td>
                      )}
                      {!isMobile && (
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {entry.badges.slice(0, 3).map(badge => {
                              const BadgeIcon = badgeInfo[badge]?.icon || Trophy;
                              return (
                                <Badge
                                  key={badge}
                                  className={badgeInfo[badge]?.color || "bg-gray-100 text-gray-800"}
                                >
                                  <BadgeIcon className="h-3 w-3 mr-1" />
                                  {badgeInfo[badge]?.label || badge}
                                </Badge>
                              );
                            })}
                            {entry.badges.length > 3 && (
                              <Badge variant="outline">+{entry.badges.length - 3}</Badge>
                            )}
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  );
                })}

                {sortedData.length === 0 && (
                  <tr>
                    <td colSpan={isMobile ? 4 : 6} className={`${isMobile ? 'p-4' : 'p-8'} text-center text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
                      No users found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
