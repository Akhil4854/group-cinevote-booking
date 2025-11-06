"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, MapPin, Users, CreditCard, CheckCircle2, Armchair } from 'lucide-react';
import { toast } from 'sonner';

interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: string;
  rating: string;
  image: string;
  showtimes: string[];
}

interface Group {
  id: string;
  name: string;
  members: { id: string; name: string }[];
  winningMovie?: string;
  selectedShowtime?: string;
  selectedSeats?: string[];
}

export default function ConfirmBookingPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  
  const [group, setGroup] = useState<Group | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingComplete, setBookingComplete] = useState(false);

  const TICKET_PRICE = 12.99;
  const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const SEATS_PER_ROW = 10;

  useEffect(() => {
    fetchData();
  }, [groupId]);

  const fetchData = async () => {
    try {
      const [groupRes, moviesRes] = await Promise.all([
        fetch(`/api/groups?id=${groupId}`),
        fetch('/api/movies')
      ]);
      
      const groupData = await groupRes.json();
      const moviesData = await moviesRes.json();
      
      if (!groupData.winningMovie) {
        router.push(`/group-booking/${groupId}`);
        return;
      }
      
      setGroup(groupData);
      const winningMovie = moviesData.find((m: Movie) => m.id === groupData.winningMovie);
      setMovie(winningMovie);
      
      if (groupData.selectedShowtime) {
        setSelectedShowtime(groupData.selectedShowtime);
      }
      if (groupData.selectedSeats) {
        setSelectedSeats(groupData.selectedSeats);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seat: string) => {
    if (!group) return;
    
    const maxSeats = group.members.length;
    
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else if (selectedSeats.length < maxSeats) {
      setSelectedSeats([...selectedSeats, seat]);
    } else {
      toast.error(`You can only select ${maxSeats} seats for your group`);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedShowtime || selectedSeats.length !== group?.members.length) {
      toast.error('Please select showtime and seats for all members');
      return;
    }

    try {
      await fetch(`/api/groups/${groupId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedShowtime,
          selectedSeats,
          status: 'confirmed'
        })
      });
      
      setBookingComplete(true);
      toast.success('Booking confirmed!');
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast.error('Failed to confirm booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!group || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Data not found</p>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl">Booking Confirmed!</CardTitle>
            <CardDescription>Your group booking has been successfully confirmed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted rounded-lg p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Movie</span>
                <span className="font-semibold">{movie.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Showtime</span>
                <span className="font-semibold">{selectedShowtime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seats</span>
                <span className="font-semibold">{selectedSeats.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Group</span>
                <span className="font-semibold">{group.name} ({group.members.length} members)</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-primary">
                  ${(TICKET_PRICE * selectedSeats.length).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                A confirmation email has been sent to all group members
              </p>
              <Button onClick={() => router.push('/')} size="lg" className="w-full">
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPrice = TICKET_PRICE * group.members.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Confirm Your Booking</h1>
          <p className="text-muted-foreground">Select showtime and seats for {group.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Movie Info */}
            <Card>
              <CardHeader>
                <CardTitle>Movie Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-24 h-36 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>{movie.genre}</p>
                      <p>{movie.duration}</p>
                      <p>Rating: {movie.rating}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Showtime Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Select Showtime
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {movie.showtimes.map((time) => (
                    <Button
                      key={time}
                      variant={selectedShowtime === time ? "default" : "outline"}
                      className="h-12"
                      onClick={() => setSelectedShowtime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Seat Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Armchair className="h-5 w-5" />
                  Select Seats ({selectedSeats.length}/{group.members.length})
                </CardTitle>
                <CardDescription>
                  Select {group.members.length} seats for your group
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-t-2xl py-2 text-center text-sm font-semibold">
                    SCREEN
                  </div>
                  <div className="space-y-2">
                    {ROWS.map((row) => (
                      <div key={row} className="flex items-center gap-2">
                        <span className="w-6 text-center font-semibold text-sm text-muted-foreground">
                          {row}
                        </span>
                        <div className="flex gap-2 flex-1 justify-center">
                          {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                            const seatNumber = i + 1;
                            const seatId = `${row}${seatNumber}`;
                            const isSelected = selectedSeats.includes(seatId);
                            const isOccupied = Math.random() > 0.7 && !isSelected; // Random occupied seats

                            return (
                              <button
                                key={seatId}
                                onClick={() => !isOccupied && toggleSeat(seatId)}
                                disabled={isOccupied}
                                className={`w-8 h-8 rounded-t-lg border-2 transition-all ${
                                  isOccupied
                                    ? 'bg-muted border-muted cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-primary border-primary text-primary-foreground'
                                    : 'bg-background border-border hover:border-primary'
                                }`}
                              >
                                {isOccupied ? '✕' : ''}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-6 pt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-t-lg border-2 border-border bg-background" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-t-lg border-2 border-primary bg-primary" />
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-t-lg border-2 border-muted bg-muted" />
                      <span>Occupied</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Group:</span>
                    <span className="font-semibold">{group.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Members:</span>
                    <span className="font-semibold">{group.members.length}</span>
                  </div>
                  {selectedShowtime && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-semibold">{selectedShowtime}</span>
                    </div>
                  )}
                  {selectedSeats.length > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                      <Armchair className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-muted-foreground">Seats:</span>
                      <span className="font-semibold">{selectedSeats.join(', ')}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {group.members.length} × Ticket
                    </span>
                    <span>${(TICKET_PRICE * group.members.length).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Booking Fee</span>
                    <span>$2.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      ${(totalPrice + 2).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleConfirmBooking}
                  disabled={!selectedShowtime || selectedSeats.length !== group.members.length}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Confirm & Pay
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By confirming, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
