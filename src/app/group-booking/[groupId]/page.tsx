"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Film, Vote, Check, Copy, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface Movie {
  id: string;
  title: string;
  poster: string;
  rating: string;
  year: string;
  genre: string;
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
  const [showWinner, setShowWinner] = useState(false);

  useEffect(() => {
    let id = localStorage.getItem(`member_${groupId}`);
    if (!id) {
      id = Math.random().toString(36).substring(2, 9);
      localStorage.setItem(`member_${groupId}`, id);
    }
    setMemberId(id);
    
    fetchData();
    const interval = setInterval(fetchData, 3000);
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
      
      const member = groupData.members.find((m: any) => m.id === memberId);
      if (member) {
        setHasJoined(true);
        setMemberName(member.name);
        if (member.vote) {
          setSelectedMovie(member.vote);
        }
      }

      // Show winner animation
      if (groupData.winningMovie && !showWinner) {
        setTimeout(() => setShowWinner(true), 500);
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
      toast.success(`Welcome to the squad, ${memberName}!`);
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
    toast.success('Link copied! Share it with your squad');
  };

  const handleProceedToBooking = () => {
    if (group?.winningMovie) {
      router.push(`/group-booking/${groupId}/confirm`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
          <p className="text-muted-foreground">Loading your squad...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Film className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl text-muted-foreground">Squad not found</p>
        </div>
      </div>
    );
  }

  const totalVotes = Object.values(group.votes).reduce((a, b) => a + b, 0);
  const winningMovie = group.winningMovie ? movies.find(m => m.id === group.winningMovie) : null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-animate opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background" />

      <div className="container relative mx-auto px-4 py-12">
        {!hasJoined ? (
          <div className="min-h-[80vh] flex items-center justify-center">
            <Card className="max-w-md w-full glass glow-border fade-in">
              <CardContent className="p-8 md:p-12 space-y-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2 glow-text">{group.name}</h2>
                  <p className="text-muted-foreground">Join the squad to vote</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-lg">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleJoinGroup()}
                      className="h-12 text-lg glass border-primary/30 focus:border-primary"
                    />
                  </div>
                  <Button 
                    className="w-full h-12 text-lg glow-border bg-primary hover:bg-primary/90" 
                    onClick={handleJoinGroup}
                    disabled={!memberName.trim()}
                  >
                    Join Squad
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <p className="text-sm text-muted-foreground text-center">
                    Created by {group.createdBy} • {group.members.length} members
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-8 fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2 glow-text">{group.name}</h1>
                  <p className="text-muted-foreground">Created by {group.createdBy}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleCopyLink} 
                  className="glass glow-border hover:bg-primary/10 w-full md:w-auto"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Share Squad Link
                </Button>
              </div>

              <div className="glass glow-border rounded-lg p-6">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{group.members.length}</p>
                      <p className="text-sm text-muted-foreground">Members</p>
                    </div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Vote className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalVotes}</p>
                      <p className="text-sm text-muted-foreground">Total Votes</p>
                    </div>
                  </div>
                  {group.winningMovie && (
                    <>
                      <div className="h-12 w-px bg-border" />
                      <Badge variant="default" className="gap-2 px-4 py-2 text-base glow-border">
                        <Trophy className="h-5 w-5" />
                        Winner Decided!
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Winner Announcement */}
            {group.winningMovie && winningMovie && showWinner && (
              <Card className="mb-8 glass glow-border border-primary/50 fade-in">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4">
                      <Trophy className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2 glow-text">🎉 Winner!</h2>
                    <p className="text-muted-foreground">Your squad has decided</p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="relative group">
                      <img
                        src={winningMovie.poster}
                        alt={winningMovie.title}
                        className="w-48 h-72 object-cover rounded-lg glow-border"
                      />
                      <Badge className="absolute -top-3 -right-3 bg-primary glow-border">
                        Winner
                      </Badge>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-3xl font-bold mb-3">{winningMovie.title}</h3>
                      <div className="flex items-center gap-2 text-yellow-400 mb-3 justify-center md:justify-start">
                        <span className="text-2xl">⭐</span>
                        <span className="text-xl font-semibold">{winningMovie.rating}</span>
                      </div>
                      <p className="text-muted-foreground mb-6">
                        {winningMovie.year} • {winningMovie.genre}
                      </p>
                      <Button 
                        onClick={handleProceedToBooking} 
                        size="lg" 
                        className="glow-border bg-primary hover:bg-primary/90 text-lg h-14 px-8"
                      >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Book Tickets Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Voting Section */}
            {!group.winningMovie && (
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-3 glow-text">Cast Your Vote</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  {selectedMovie ? 'Vote recorded! You can change it anytime.' : 'Select your favorite movie'}
                </p>
              </div>
            )}

            {/* Movies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
              {movies.map((movie) => {
                const voteCount = group.votes[movie.id] || 0;
                const votePercentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                const isSelected = selectedMovie === movie.id;
                const isWinner = group.winningMovie === movie.id;

                return (
                  <Card 
                    key={movie.id} 
                    className={`transition-all duration-300 glass ${
                      isSelected ? 'glow-border ring-2 ring-primary scale-105' : ''
                    } ${isWinner ? 'glow-border ring-2 ring-primary' : 'hover:border-primary/50'}`}
                  >
                    <CardContent className="p-0">
                      <div className="relative group">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-96 object-cover rounded-t-lg"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-center gap-2 text-yellow-400 text-sm mb-2">
                              <span>⭐</span>
                              <span className="font-semibold">{movie.rating}</span>
                            </div>
                            <h3 className="font-bold text-white text-lg mb-1">{movie.title}</h3>
                            <p className="text-xs text-gray-300">{movie.year} • {movie.genre}</p>
                          </div>
                        </div>
                        
                        {isWinner && (
                          <Badge className="absolute top-3 left-3 bg-primary glow-border">
                            <Trophy className="h-3 w-3 mr-1" />
                            Winner
                          </Badge>
                        )}
                      </div>

                      <div className="p-4 space-y-3 bg-card/50 backdrop-blur-sm">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Votes</span>
                            <span className="font-bold text-primary">{voteCount}</span>
                          </div>
                          <Progress value={votePercentage} className="h-2 bg-muted/30" />
                          <p className="text-xs text-center text-muted-foreground">{votePercentage.toFixed(0)}%</p>
                        </div>

                        <Button
                          className={`w-full ${isSelected ? 'glow-border' : ''}`}
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
                            <>
                              <Vote className="h-4 w-4 mr-2" />
                              Vote
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Members Section */}
            <Card className="glass glow-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="h-6 w-6 text-primary" />
                  <h3 className="text-2xl font-bold">Squad Members ({group.members.length})</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {group.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 rounded-lg glass border border-border/50"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{member.name}</p>
                        {member.vote ? (
                          <p className="text-xs text-primary flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            Voted
                          </p>
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