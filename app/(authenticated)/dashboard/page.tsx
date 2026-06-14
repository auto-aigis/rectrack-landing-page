"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/app/_components/AuthProvider";
import { gamesApi } from "@/app/_lib/api";
import { Game } from "@/app/_lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function DashboardPage() {
  const authContext = useContext(AuthContext);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await gamesApi.list();
        setGames(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load games");
      } finally {
        setLoading(false);
      }
    };

    if (!authContext?.loading) {
      load();
    }
  }, [authContext?.loading]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/games/new">
          <Button>Add Game</Button>
        </Link>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-4 rounded">
          {error}
        </div>
      )}

      {games.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No games yet</p>
          <Link href="/games/new">
            <Button>Create your first game</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <Link key={game.id} href={`/games/${game.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{game.sport}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {new Date(game.played_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium mt-2">{game.position}</p>
                  {game.stats_json.points && (
                    <p className="text-sm text-gray-600">
                      Points: {game.stats_json.points}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
