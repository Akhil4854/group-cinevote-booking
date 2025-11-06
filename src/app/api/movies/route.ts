import { NextResponse } from 'next/server';

export interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: string;
  rating: string;
  image: string;
  description: string;
  showtimes: string[];
}

const movies: Movie[] = [
  {
    id: '1',
    title: 'The Cosmic Journey',
    genre: 'Sci-Fi',
    duration: '2h 15m',
    rating: '8.5/10',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=1200&fit=crop',
    description: 'An epic space adventure that takes you beyond the stars.',
    showtimes: ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM']
  },
  {
    id: '2',
    title: 'Shadow in the Night',
    genre: 'Thriller',
    duration: '1h 55m',
    rating: '8.2/10',
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=1200&fit=crop',
    description: 'A gripping thriller that will keep you on the edge of your seat.',
    showtimes: ['11:00 AM', '2:00 PM', '5:00 PM', '8:00 PM', '11:00 PM']
  },
  {
    id: '3',
    title: 'Laughter Therapy',
    genre: 'Comedy',
    duration: '1h 40m',
    rating: '7.8/10',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=1200&fit=crop',
    description: 'The funniest movie of the year that will leave you in stitches.',
    showtimes: ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM']
  },
  {
    id: '4',
    title: 'Forever Yours',
    genre: 'Romance',
    duration: '2h 05m',
    rating: '8.0/10',
    image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&h=1200&fit=crop',
    description: 'A heartwarming love story that transcends time.',
    showtimes: ['10:30 AM', '1:30 PM', '4:30 PM', '7:30 PM', '10:30 PM']
  },
  {
    id: '5',
    title: 'Dragon Warriors',
    genre: 'Action',
    duration: '2h 25m',
    rating: '8.7/10',
    image: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=800&h=1200&fit=crop',
    description: 'Non-stop action with breathtaking martial arts sequences.',
    showtimes: ['11:30 AM', '2:30 PM', '5:30 PM', '8:30 PM']
  },
  {
    id: '6',
    title: 'The Haunting',
    genre: 'Horror',
    duration: '1h 50m',
    rating: '7.5/10',
    image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&h=1200&fit=crop',
    description: 'A terrifying experience that will haunt your dreams.',
    showtimes: ['12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM', '12:00 AM']
  }
];

export async function GET() {
  return NextResponse.json(movies);
}
