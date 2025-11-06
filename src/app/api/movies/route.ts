import { NextResponse } from 'next/server';

export interface Movie {
  id: string;
  title: string;
  poster: string;
  rating: string;
  year: string;
  genre: string;
}

const movies: Movie[] = [
  {
    id: '1',
    title: 'Dune: Part Two',
    poster: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    rating: '8.5/10',
    year: '2024',
    genre: 'Sci-Fi, Adventure'
  },
  {
    id: '2',
    title: 'Joker: Folie à Deux',
    poster: 'https://image.tmdb.org/t/p/w500/if8QiqCI7WAGImKcJCfzp6VTyKA.jpg',
    rating: '7.2/10',
    year: '2024',
    genre: 'Drama, Thriller'
  },
  {
    id: '3',
    title: 'Deadpool & Wolverine',
    poster: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    rating: '8.8/10',
    year: '2024',
    genre: 'Action, Comedy'
  },
  {
    id: '4',
    title: 'Inside Out 2',
    poster: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    rating: '8.9/10',
    year: '2024',
    genre: 'Animation, Family'
  },
  {
    id: '5',
    title: 'Venom: The Last Dance',
    poster: 'https://image.tmdb.org/t/p/w500/aosm8NMQ3UyoBVpSxyimorCQykC.jpg',
    rating: '7.6/10',
    year: '2024',
    genre: 'Action, Sci-Fi'
  }
];

export async function GET() {
  return NextResponse.json(movies);
}