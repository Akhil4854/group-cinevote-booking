"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Film, Share2 } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: string;
  rating: string;
  image: string;
  description: string;
}

export default function GroupBookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [groupName, setGroupName] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/movies');
      const data = await res.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (step === 1 && groupName && createdBy) {
      fetchMovies();
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
      router.push(`/group-booking/${group.id}`);
    } catch (error) {
      console.error('Error creating group:', error);
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Create Group Booking</h1>
          <p className="text-muted-foreground">Book movie tickets together with your friends</p>
        </div>

        {step === 1 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Step 1: Group Information
              </CardTitle>
              <CardDescription>
                Set up your group and invite your friends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  placeholder="e.g., Friday Night Movie Squad"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="createdBy">Your Name</Label>
                <Input
                  id="createdBy"
                  placeholder="Enter your name"
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.target.value)}
                />
              </div>
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleNextStep}
                disabled={!groupName || !createdBy}
              >
                Continue to Movie Selection
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <div className="max-w-6xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  Step 2: Select Movies for Voting
                </CardTitle>
                <CardDescription>
                  Choose at least 2 movies for your group to vote on
                </CardDescription>
              </CardHeader>
            </Card>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading movies...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {movies.map((movie) => (
                    <Card 
                      key={movie.id} 
                      className={`cursor-pointer transition-all ${
                        selectedMovies.includes(movie.id) 
                          ? 'ring-2 ring-primary' 
                          : 'hover:shadow-lg'
                      }`}
                      onClick={() => toggleMovie(movie.id)}
                    >
                      <CardContent className="p-0">
                        <div className="relative">
                          <img
                            src={movie.image}
                            alt={movie.title}
                            className="w-full h-64 object-cover rounded-t-lg"
                          />
                          <div className="absolute top-2 right-2">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedMovies.includes(movie.id)
                                ? 'bg-primary border-primary'
                                : 'bg-background border-muted-foreground'
                            }`}>
                              {selectedMovies.includes(movie.id) && (
                                <div className="w-3 h-3 bg-primary-foreground rounded-full" />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-1">{movie.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {movie.genre} • {movie.duration} • {movie.rating}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {movie.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="sticky bottom-4">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">
                          {selectedMovies.length} movies selected
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Select at least 2 movies to continue
                        </p>
                      </div>
                      <Button
                        size="lg"
                        onClick={handleNextStep}
                        disabled={selectedMovies.length < 2 || loading}
                        className="gap-2"
                      >
                        <Share2 className="h-4 w-4" />
                        Create Group & Get Link
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
