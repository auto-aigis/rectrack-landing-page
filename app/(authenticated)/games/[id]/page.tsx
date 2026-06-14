"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { gamesApi } from "@/app/_lib/api";
import { Game } from "@/app/_lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [played_at, setPlayedAt] = useState("");
  const [sport, setSport] = useState("");
  const [position, setPosition] = useState("");
  const [points, setPoints] = useState("");
  const [assists, setAssists] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const g = await gamesApi.get(id) as Game;
        setGame(g);

        setPlayedAt(g.played_at.split("T")[0]);
        setSport(g.sport);
        setPosition(g.position);
        setNotes(g.notes);
        if (g.stats_json.points) setPoints(String(g.stats_json.points));
        if (g.stats_json.assists) setAssists(String(g.stats_json.assists));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load game");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUpdating(true);

    try {
      const stats_json: Record<string, any> = {};
      if (points) stats_json.points = parseInt(points);
      if (assists) stats_json.assists = parseInt(assists);

      await gamesApi.update(id, played_at, sport, position, stats_json, notes);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update game");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <p className="text-gray-500">Game not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Game</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="played_at">Date</Label>
              <Input
                id="played_at"
                type="date"
                value={played_at}
                onChange={(e) => setPlayedAt(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="sport">Sport</Label>
              <Select value={sport} onValueChange={setSport}>
                <SelectTrigger id="sport">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basketball">Basketball</SelectItem>
                  <SelectItem value="Football">Football</SelectItem>
                  <SelectItem value="Soccer">Soccer</SelectItem>
                  <SelectItem value="Baseball">Baseball</SelectItem>
                  <SelectItem value="Tennis">Tennis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="points">Points (optional)</Label>
              <Input
                id="points"
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="assists">Assists (optional)</Label>
              <Input
                id="assists"
                type="number"
                value={assists}
                onChange={(e) => setAssists(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={updating} className="flex-1">
                {updating ? "Saving..." : "Save Game"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
