"use client"

import { Button } from '@/components/ui/button';
import { Film, Sparkles, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 gradient-animate opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background" />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="container mx-auto text-center fade-in">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-7xl md:text-9xl font-bold glow-text tracking-wider mb-4">
              CINESQUAD
            </h1>
            <div className="flex items-center justify-center gap-2 text-xl md:text-2xl text-muted-foreground">
              <Film className="h-6 w-6 text-primary" />
              <p className="font-light tracking-wide">Vote. Decide. Watch Together.</p>
              <Film className="h-6 w-6 text-primary" />
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-12">
            <Button 
              size="lg" 
              className="text-xl h-16 px-12 glow-border bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
              onClick={() => router.push('/group-booking')}
            >
              <Sparkles className="mr-2 h-6 w-6" />
              Start Voting
            </Button>
          </div>

          {/* Decorative elements */}
          <div className="mt-20 flex justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>Group Voting</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Film className="h-4 w-4 text-primary" />
              <span>Instant Booking</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Cinema Experience</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary rounded-full" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 CINESQUAD. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}