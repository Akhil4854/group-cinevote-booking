"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Users, Film, Sparkles, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Movie {
  id: string;
  title: string;
  poster: string;
  rating: string;
  year: string;
  genre: string;
}

export default function GroupBookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [groupName, setGroupName] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/movies');
      const data = await res.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (step === 1 && groupName && createdBy) {
      setStep(2);
    } else if (step === 2 && selectedMovies.length >= 2) {
      createGroup();
    }
  };

  const createGroup = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: groupName,
          createdBy,
          movies: selectedMovies
        })
      });
      const group = await res.json();
      toast.success('Group created! Share the link with friends');
      router.push(`/group-booking/${group.id}`);
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const toggleMovie = (movieId: string) => {
    setSelectedMovies(prev => 
      prev.includes(movieId) 
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-animate opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background" />

      <div className="container relative mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 glow-text">
            Create Your Squad
          </h1>
          <p className="text-xl text-muted-foreground">
            {step === 1 ? 'Set up your group details' : 'Choose movies to vote on'}
          </p>
        </div>

        {step === 1 && (
          <Card className="max-w-2xl mx-auto glass glow-border fade-in">
            <CardContent className="p-8 md:p-12 space-y-8">
              <div className="flex items-center gap-3 text-primary mb-6">
                <Users className="h-8 w-8" />
                <h2 className="text-2xl font-semibold">Group Details</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="groupName" className="text-lg">Squad Name</Label>
                  <Input
                    id="groupName"
                    placeholder="e.g., Friday Night Movie Squad"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="h-14 text-lg glass border-primary/30 focus:border-primary"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="createdBy" className="text-lg">Your Name</Label>
                  <Input
                    id="createdBy"
                    placeholder="Enter your name"
                    value={createdBy}
                    onChange={(e) => setCreatedBy(e.target.value)}
                    className="h-14 text-lg glass border-primary/30 focus:border-primary"
                  />
                </div>

                <Button 
                  className="w-full h-14 text-lg glow-border bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02]" 
                  onClick={handleNextStep}
                  disabled={!groupName || !createdBy}
                >
                  Continue to Movie Selection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <div className="max-w-7xl mx-auto fade-in">
            <div className="mb-8 glass glow-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <Film className="h-6 w-6" />
                    <h2 className="text-xl font-semibold">Select Movies to Vote</h2>
                  </div>
                  <p className="text-muted-foreground">
                    Choose at least 2 movies • {selectedMovies.length} selected
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={handleNextStep}
                  disabled={selectedMovies.length < 2 || loading}
                  className="glow-border bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Create Squad
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                <p className="mt-4 text-muted-foreground">Loading movies...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {movies.map((movie) => (
                  <Card 
                    key={movie.id} 
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 glass ${
                      selectedMovies.includes(movie.id) 
                        ? 'glow-border ring-2 ring-primary' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => toggleMovie(movie.id)}
                  >
                    <CardContent className="p-0">
                      <div className="relative group">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-96 object-cover rounded-t-lg"
                        />
                        {/* Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity ${
                          selectedMovies.includes(movie.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}>
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-center gap-2 text-yellow-400 text-sm mb-1">
                              <span>⭐</span>
                              <span className="font-semibold">{movie.rating}</span>
                            </div>
                            <h3 className="font-bold text-white text-lg mb-1">{movie.title}</h3>
                            <p className="text-xs text-gray-300">{movie.year} • {movie.genre}</p>
                          </div>
                        </div>
                        
                        {/* Checkmark */}
                        <div className="absolute top-3 right-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            selectedMovies.includes(movie.id)
                              ? 'bg-primary glow-border'
                              : 'bg-black/50 border border-white/30'
                          }`}>
                            {selectedMovies.includes(movie.id) && (
                              <Check className="w-6 h-6 text-white" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}