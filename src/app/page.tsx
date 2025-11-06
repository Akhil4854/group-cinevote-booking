"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Vote, Calendar, CheckCircle, Film, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              Group Booking Made Easy
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
              Watch Movies
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Together, Decide Together
              </span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
              Book movie tickets as a group. Vote on your favorite movie and let democracy decide what you watch!
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                className="text-lg h-14 px-8"
                onClick={() => router.push('/group-booking')}
              >
                <Users className="mr-2 h-5 w-5" />
                Start Group Booking
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg h-14 px-8"
              >
                <Film className="mr-2 h-5 w-5" />
                Browse Movies
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">How It Works</h2>
          <p className="text-lg text-muted-foreground">
            Four simple steps to book your group movie experience
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden border-2 transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div className="absolute right-4 top-4 text-6xl font-bold text-muted/10">1</div>
              <h3 className="mb-2 text-xl font-semibold">Create Group</h3>
              <p className="text-sm text-muted-foreground">
                Start a group and select movies you want to watch
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div className="absolute right-4 top-4 text-6xl font-bold text-muted/10">2</div>
              <h3 className="mb-2 text-xl font-semibold">Invite Friends</h3>
              <p className="text-sm text-muted-foreground">
                Share the group link with your friends to join
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Vote className="h-6 w-6" />
              </div>
              <div className="absolute right-4 top-4 text-6xl font-bold text-muted/10">3</div>
              <h3 className="mb-2 text-xl font-semibold">Vote Together</h3>
              <p className="text-sm text-muted-foreground">
                Everyone votes for their favorite movie. Majority wins!
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="absolute right-4 top-4 text-6xl font-bold text-muted/10">4</div>
              <h3 className="mb-2 text-xl font-semibold">Book & Enjoy</h3>
              <p className="text-sm text-muted-foreground">
                Select seats, confirm booking, and enjoy the movie!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-2">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Vote className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Democratic Voting</h3>
                <p className="text-muted-foreground">
                  Fair and transparent voting system ensures everyone's voice is heard. The movie with the most votes wins automatically.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Easy Sharing</h3>
                <p className="text-muted-foreground">
                  Share your group link instantly. Friends can join with just their name - no sign up required!
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Flexible Showtimes</h3>
                <p className="text-muted-foreground">
                  Choose from multiple showtimes that work for your group. Book the perfect time for everyone.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Seat Selection</h3>
                <p className="text-muted-foreground">
                  Select seats together and sit next to your friends. Visual seat map makes it easy to choose the best spots.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="mx-auto max-w-4xl border-2 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
          <CardContent className="p-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Watch Together?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Create your first group booking now and let your friends vote on the perfect movie!
            </p>
            <Button 
              size="lg" 
              className="text-lg h-14 px-8"
              onClick={() => router.push('/group-booking')}
            >
              <Users className="mr-2 h-5 w-5" />
              Create Group Booking
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 CineQuad. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}