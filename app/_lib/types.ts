export interface Game {
  id: string;
  date: string;
  sport: string;
  position: string;
  location?: string;
  duration_minutes: number;
  score: number;
  opponent_score?: number;
  performance_metrics: Record<string, number>;
  notes?: string;
  created_at: string;
}

export interface GameDetail extends Game {
  ai_insight?: string;
}

export interface User {
  id: string;
  email: string;
  tier: 'free' | 'pro' | 'elite';
  onboarding_complete: boolean;
  verified: boolean;
}

export interface TrendData {
  date: string;
  metric: string;
  value: number;
}

export interface WeeklyInsight {
  week: string;
  insights: string[];
  highlights: string[];
  areas_for_improvement: string[];
}

export interface DashboardSummary {
  total_games: number;
  current_streak: number;
  average_score: number;
  favorite_sport: string;
  recent_games: Game[];
}

export interface SubscriptionInfo {
  tier: 'free' | 'pro' | 'elite';
  paddle_customer_id?: string;
  status: 'active' | 'trialing' | 'past_due' | 'cancelled';
}
