"use client";

import { useEffect, useState } from 'react';
import { gamesApi, dashboardApi, analyticsApi, weeklyApi } from './api';
import { Game, GameDetail, TrendData, WeeklyInsight } from './types';

export function useDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await dashboardApi.summary();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { data, loading, error };
}

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGames = async () => {
    try {
      const result = await gamesApi.list();
      setGames(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  return { games, loading, error, refetch: loadGames };
}

export function useGameDetail(gameId: string) {
  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await gamesApi.detail(gameId);
        setGame(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load game');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [gameId]);

  return { game, loading, error };
}

export function useTrends() {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await analyticsApi.trends();
        setTrends(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load trends');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { trends, loading, error };
}

export function useWeeklyInsights() {
  const [insights, setInsights] = useState<WeeklyInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    try {
      await weeklyApi.generate();
      const result = await weeklyApi.insights();
      setInsights(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate insights');
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const result = await weeklyApi.insights();
        setInsights(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load insights');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { insights, loading, error, generate };
}
