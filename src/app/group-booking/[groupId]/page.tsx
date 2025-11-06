"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Film, Vote, Check, Copy, Trophy, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: string;
  rating: string;
  image: string;
  description: string;
}

interface Group {
  id: string;
  name: string;
  createdBy: string;
  members: { id: string; name: string; vote?: string }[];
  movies: string[];
  votes: Record<string, number>;
  winningMovie?: string;
  status: string;
}

export default function GroupVotingPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  
  const [group, setGroup] = useState<Group | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [memberName, setMemberName] = useState('');
  const [memberId, setMemberId] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate or retrieve member ID
    let id = localStorage.getItem(`member_${groupId}`);
    if (!id) {
      id = Math.random().toString(36).substring(2, 9);
      localStorage.setItem(`member_${groupId}`, id);
    }
    setMemberId(id);
    
    fetchData();
    const interval = setInterval(fetchData, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [groupId]);

  const fetchData = async () => {
    try {
      const [groupRes, moviesRes] = await Promise.all([
        fetch(`/api/groups?id=${groupId}`),
        fetch('/api/movies')
      ]);
      
      const groupData = await groupRes.json();
      const moviesData = await moviesRes.json();
      
      setGroup(groupData);
      setMovies(moviesData.filter((m: Movie) => groupData.movies.includes(m.id)));
      
      // Check if current user has joined
      const member = groupData.members.find((m: any) => m.id === memberId);
      if (member) {
        setHasJoined(true);
        setMemberName(member.name);
        if (member.vote) {
          setSelectedMovie(member.vote);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = () => {
    if (memberName.trim()) {
      setHasJoined(true);
    }
  };

  const handleVote = async (movieId: string) => {
    if (!hasJoined || !memberName) return;

    try {
      const res = await fetch(`/api/groups/${groupId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          memberName,
          movieId
        })
      });
      
      const updatedGroup = await res.json();
      setGroup(updatedGroup);
      setSelectedMovie(movieId);
      toast.success('Vote recorded!');
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to record vote');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleProceedToBooking = () => {
    if (group?.winningMovie) {
      router.push(`/group-booking/${groupId}/confirm`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Group not found</p>
      </div>
    );
  }

  const totalVotes = Object.values(group.votes).reduce((a, b) => a + b, 0);
  const winningMovie = group.winningMovie ? movies.find(m => m.id === group.winningMovie) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {!hasJoined ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Join {group.name}</CardTitle>
              <CardDescription>Enter your name to join the group and vote</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleJoinGroup()}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleJoinGroup}
                disabled={!memberName.trim()}
              >
                Join Group
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{group.name}</h1>
                  <p className="text-muted-foreground">Created by {group.createdBy}</p>
                </div>
                <Button variant="outline" onClick={handleCopyLink} className="gap-2">
                  <Copy className="h-4 w-4" />
                  Copy Link
                </Button>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold">{group.members.length} Members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Vote className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold">{totalVotes} Votes</span>
                      </div>
                    </div>
                    {group.winningMovie && (
                      <Badge variant="default" className="gap-1">
                        <Trophy className="h-3 w-3" />
                        Winner Decided!
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {group.winningMovie && winningMovie ? (
              <Card className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-primary" />
                    Winning Movie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-6">
                    <img
                      src={winningMovie.image}
                      alt={winningMovie.title}
                      className="w-32 h-48 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{winningMovie.title}</h3>
                      <p className="text-muted-foreground mb-4">
                        {winningMovie.genre} • {winningMovie.duration} • {winningMovie.rating}
                      </p>
                      <p className="text-sm mb-4">{winningMovie.description}</p>
                      <Button onClick={handleProceedToBooking} size="lg" className="gap-2">
                        <Clock className="h-4 w-4" />
                        Select Showtime & Book
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Vote for Your Movie</h2>
                <p className="text-muted-foreground mb-6">
                  {selectedMovie ? 'Your vote has been recorded. You can change it anytime.' : 'Select a movie to cast your vote'}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies.map((movie) => {
                const voteCount = group.votes[movie.id] || 0;
                const votePercentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                const isSelected = selectedMovie === movie.id;
                const isWinner = group.winningMovie === movie.id;

                return (
                  <Card 
                    key={movie.id} 
                    className={`transition-all ${
                      isSelected ? 'ring-2 ring-primary' : ''
                    } ${isWinner ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={movie.image}
                          alt={movie.title}
                          className="w-full h-64 object-cover rounded-t-lg"
                        />
                        {isWinner && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="default" className="gap-1">
                              <Trophy className="h-3 w-3" />
                              Winner
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{movie.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {movie.genre} • {movie.duration} • {movie.rating}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Votes</span>
                            <span className="font-semibold">{voteCount}</span>
                          </div>
                          <Progress value={votePercentage} className="h-2" />
                        </div>

                        <Button
                          className="w-full"
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => handleVote(movie.id)}
                          disabled={!!group.winningMovie}
                        >
                          {isSelected ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Your Vote
                            </>
                          ) : (
                            'Vote for This'
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Group Members ({group.members.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {group.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-2 p-3 rounded-lg bg-muted"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{member.name}</p>
                        {member.vote ? (
                          <p className="text-xs text-muted-foreground">Voted</p>
                        ) : (
                          <p className="text-xs text-muted-foreground">Pending</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
