export interface User {
  id: string;
  email: string;
  display_name: string;
  primary_sport: string | null;
  position: string | null;
  onboarding_complete: boolean;
  tier: 'free' | 'pro' | 'elite';
}

export interface Subscription {
  tier: 'free' | 'pro' | 'elite';
  status: string;
  current_period_end: string | null;
  paddle_subscription_id: string | null;
}

export interface Game {
  id: string;
  sport: string;
  result: 'W' | 'L';
  opponent_name: string | null;
  feeling_notes: string | null;
  stats: Record<string, number>;
  logged_at: string;
}

export interface AITip {
  id: string;
  tip_type: 'post_game' | 'pre_game' | 'weekly';
  content: string;
  generated_at: string;
}

export interface DashboardData {
  recent_games: Game[];
  total_games: number;
  win_rate: number;
  current_streak: number;
  pre_game_tip: AITip | null;
}

export interface WeeklyInsight {
  id: string;
  week_start: string;
  week_end: string;
  summary_content: string;
  stats_snapshot: Record<string, any>;
  generated_at: string;
}

export interface Sport {
  name: string;
  positions: string[];
}

export interface AnalyticsTrends {
  dates: string[];
  points_per_game: number[];
  win_rate: number[];
  error_rate: number[];
}

export interface PercentileBadge {
  metric: string;
  percentile: number;
  label: string;
}

export interface SeasonStats {
  this_year: { total_games: number; wins: number; win_rate: number };
  last_year: { total_games: number; wins: number; win_rate: number };
}
