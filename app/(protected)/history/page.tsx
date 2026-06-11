'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/app/_components/AuthProvider';

export default function HistoryPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder: load matches from API
    setLoading(false);
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Match History</h1>
        <p className="text-muted-foreground">
          View all your logged matches
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Matches</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : matches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No matches logged yet. Start by logging your first match!
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{match.date}</div>
                    <div className="text-sm text-muted-foreground">{match.location}</div>
                  </div>
                  <Badge variant={match.result === 'win' ? 'default' : 'destructive'}>
                    {match.result}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}