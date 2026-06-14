export interface User {
  id: string;
  email: string;
  display_name: string;
  timezone: string;
  sport: string;
  position: string | null;
}

export interface Subscription {
  id: string;
  status: "active" | "inactive";
  tier: "free" | "pro" | "elite";
  current_period_end: string | null;
}

export interface Game {
  id: string;
  user_id: string;
  played_at: string;
  sport: string;
  position: string;
  stats_json: Record<string, any>;
  notes: string;
  created_at: string;
}

export interface DashboardData {
  streak_weeks: number;
  milestone_to_show: number | null;
  recent_games: Game[];
  user: User;
  subscription: Subscription;
}

export interface AuthResponse {
  user: User;
  subscription: Subscription;
}

export interface RegisterRequest {
  email: string;
  password: string;
  display_name: string;
  timezone: string;
  sport: string;
}

export interface RegisterResponse {
  status: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends User {}

export interface VerifyTransactionRequest {
  transaction_id: string;
}

export interface VerifyTransactionResponse {
  status: string;
  tier: string;
}