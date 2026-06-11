export type SubscriptionTier = 'free' | 'pro' | 'plus';
export type SubscriptionStatus = 'inactive' | 'active' | 'trialing' | 'canceled';

export interface User {
  id: string;
  email: string;
  display_name: string | null;
  sport: string;
  position: string | null;
  subscription_tier: SubscriptionTier;
  onboarding_complete: boolean;
}

export interface Subscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  current_period_end: string | null;
  trial_ends_at: string | null;
}

export interface Game {
  id: string;
  date: string;
  sport: string;
  score: string;
  opponent_partner_name: string | null;
  serves_attempted: number | null;
  serving_faults: number | null;
  rallies_won: number | null;
  unforced_errors: number | null;
  dinks: number | null;
  smashes: number | null;
  kitchen_violations: number | null;
  created_at: string;
  coaching_tip: string | null;
}

export interface CreateGameRequest {
  date: string;
  score: string;
  opponent_partner_name?: string;
  serves_attempted?: number;
  serving_faults?: number;
  rallies_won?: number;
  unforced_errors?: number;
  dinks?: number;
  smashes?: number;
  kitchen_violations?: number;
}

export interface CoachingTip {
  tip_text: string | null;
  generated_at: string | null;
}

export interface WeeklySummary {
  summary: string;
  generated_at: string;
}

export interface SeasonSummary {
  summary: string;
  generated_at: string;
}

export interface Achievement {
  slug: string;
  unlocked_at: string;
}

export interface HistoryResponse {
  games: Game[];
  tier: SubscriptionTier;
  locked: boolean;
}

export interface CheckoutResponse {
  price_id: string;
  client_token: string;
}

export interface VerifyTransactionResponse {
  status: string;
  tier: string;
}

export interface PortalUrlResponse {
  portal_url: string;
}

export interface UpgradeResponse {
  status: string;
  tier: string;
}

export interface OnboardingRequest {
  display_name: string;
  position: string;
}

export interface ProfileUpdateRequest {
  display_name?: string;
  position?: string;
}

export interface AuthResponse {
  status?: string;
  email?: string;
}

export interface LogoutResponse {
  status: string;
}

export interface RegisterResponse {
  status: string;
  email: string;
}

export interface VerifyEmailResponse {
  status: string;
}

export interface ResendVerificationResponse {
  status: string;
}

export interface CsvExportResponse {
  csv: string;
}

export interface PregameTipResponse {
  tip_text: string;
}

export interface AchievementsResponse {
  achievements: Achievement[];
}