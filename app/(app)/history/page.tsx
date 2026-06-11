'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, Lock } from 'lucide-react';
import { gamesApi, achievementsApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_components/AuthProvider';
import type { Game, Achievement } from '@/app/_lib/types';
import Link from 'next/link';

export default function HistoryPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { subscription } = useAuth();

  const isPlus = subscription?.tier === 'plus';
  const isProOrPlus = subscription?.tier === 'pro' || subscription?.tier === 'plus';

  useEffect(() => {
    const loadData = async () => {
      try {
        const [historyData, achievementsData] = await Promise.all([
          gamesApi.getHistory(0, 50),
          isPlus ? achievementsApi.list().catch(() => ({ achievements: [] })) : Promise.resolve({ achievements: [] }),
        ]);
        setGames(historyData.games);
        setLocked(historyData.locked);
        setAchievements(achievementsData.achievements);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isPlus]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const { csv } = await gamesApi.exportCsv();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rectrack-games-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Game History</h1>
          <p className="text-gray-600 mt-1">View all your logged games</p>
        </div>
        {isPlus && (
          <Button variant="outline" onClick={handleExport} disabled={exporting}>
            {exporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Export CSV
          </Button>
        )}
      </div>

      {isPlus && achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {achievements.map((a) => (
                <Badge key={a.slug} variant="default" className="bg-yellow-500">
                  {a.slug.replace(/-/g, ' ')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {games.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No games logged yet</p>
            <Button asChild>
              <Link href="/log">Log Your First Game</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {games.map((game) => (
            <Card key={game.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{game.score}</p>
                    <p className="text-sm text-gray-500">{formatDate(game.date)}</p>
                    {game.opponent_partner_name && (
                      <p className="text-sm text-gray-600 mt-1">vs. {game.opponent_partner_name}</p>
                    )}
                  </div>
                  <div className="flex gap-1 flex-wrap justify-end max-w-[50%]">
                    {game.serves_attempted !== null && (
                      <Badge variant="outline">{game.serves_attempted} serves</Badge>
                    )}
                    {game.unforced_errors !== null && (
                      <Badge variant="outline">{game.unforced_errors} UE</Badge>
                    )}
                    {game.rallies_won !== null && (
                      <Badge variant="outline">{game.rallies_won} rallies</Badge>
                    )}
                  </div>
                </div>
                {game.coaching_tip && isProOrPlus && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-600">{game.coaching_tip}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {locked && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Unlock Full History</p>
                <p className="text-sm text-gray-600">Upgrade to Pro to see all your games</p>
              </div>
            </div>
            <Button asChild>
              <Link href="/upgrade">Upgrade</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}