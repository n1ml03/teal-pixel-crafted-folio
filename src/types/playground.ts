// Test result interface
export interface TestResult {
  passed: boolean;
  message: string;
  details?: string;
}

// Console log interface
export interface ConsoleLog {
  type: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  timestamp: string;
  source?: string;
}

// User interface
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLoginAt: string;
  level: number;
  points: number;
  badges: string[];
}

// Challenge Progress interface
export interface ChallengeProgress {
  challengeId: string;
  userId: string;
  startedAt: string;
  lastUpdatedAt: string;
  completedAt?: string;
  progress: number; // 0-100
  completedObjectives: string[];
  testResults: Record<string, boolean>;
  timeSpent: number; // in seconds
  codeSnapshots: {
    timestamp: string;
    code: string;
  }[];
  notes?: string;
}

// Activity types
export type ActivityType =
  | 'challenge_started'
  | 'challenge_completed'
  | 'achievement_unlocked'
  | 'level_up'
  | 'bug_reported'
  | 'test_passed'
  | 'test_failed';

// User Activity interface
export interface UserActivity {
  id: string;
  userId: string;
  type: ActivityType;
  timestamp: string;
  details: Record<string, unknown>;
}

// Achievement interface
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  criteria: {
    type: 'challenge_completion' | 'level' | 'points' | 'custom';
    value: string | number;
    count?: number;
  };
  points: number;
}

// User Achievement interface
export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
}

// Network request interface
export interface NetworkRequest {
  id: string;
  method: string;
  url: string;
  status: number;
  time: string;
  size: string;
  type: string;
  initiator: string;
  startTime: number;
}

// DOM element interface
export interface DOMElement {
  tag: string;
  id: string;
  classes: string[];
  attributes: Record<string, string>;
  children: number;
  path: string;
}

// User interface
export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin?: string;
  level: number;
  points: number;
  badges: string[];
}

// Achievement interface
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  criteria: {
    type: 'challenge_completion' | 'points' | 'level' | 'custom';
    value: string | number;
    count?: number;
  };
  points: number;
}

// User achievement interface
export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
  progress?: number; // For achievements that track progress (0-100)
}

// Leaderboard entry interface
export interface LeaderboardEntry {
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  points: number;
  level: number;
  challengesCompleted: number;
  rank: number;
  badges: string[];
}

// User activity interface
export interface UserActivity {
  id: string;
  userId: string;
  type: ActivityType;
  timestamp: string;
  details: Record<string, unknown>;
}

// Bug report interface
export interface BugReport {
  id: string;
  userId: string;
  challengeId?: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'functional' | 'ui' | 'performance' | 'security' | 'other';
  steps: string;
  expectedResult: string;
  actualResult: string;
  screenshotUrl?: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
}

// Testing environment interface
export interface TestingEnvironment {
  iframe: HTMLIFrameElement | null;
  url: string;
  device: 'desktop' | 'tablet' | 'mobile';
  consoleLogs: ConsoleLog[];
  networkRequests: NetworkRequest[];
  elements: DOMElement[];
}

// Challenge objective interface
export interface ChallengeObjective {
  id: string;
  description: string;
  required: boolean;
  completed: boolean;
}

// Challenge hint interface
export interface ChallengeHint {
  id: string;
  level: 'basic' | 'detailed' | 'solution';
  content: string;
}

// Challenge test interface
export interface ChallengeTest {
  id: string;
  name: string;
  description: string;
  weight: number;
  testFunction: (env: {
    iframe: HTMLIFrameElement | null;
    url: string;
    device: 'desktop' | 'tablet' | 'mobile';
    consoleLogs: ConsoleLog[];
    networkRequests: NetworkRequest[];
    elements: DOMElement[];
  }) => Promise<TestResult>;
}

// Challenge submission result
export interface ChallengeSubmissionResult {
  success: boolean;
  score: number;
  message: string;
  completedObjectives: string[];
  passedTests: string[];
  failedTests: string[];
  timeSpent: number;
}
