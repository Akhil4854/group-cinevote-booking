import { NextResponse } from 'next/server';

// In-memory storage for groups (in production, use a database)
const groups = new Map();

export interface GroupMember {
  id: string;
  name: string;
  vote?: string;
}

export interface Group {
  id: string;
  name: string;
  createdBy: string;
  members: GroupMember[];
  movies: string[];
  votes: Record<string, number>;
  winningMovie?: string;
  selectedShowtime?: string;
  selectedSeats?: string[];
  status: 'voting' | 'confirmed' | 'completed';
  createdAt: string;
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, createdBy, movies } = body;

  const groupId = Math.random().toString(36).substring(2, 9);
  
  const group: Group = {
    id: groupId,
    name,
    createdBy,
    members: [{ id: Math.random().toString(36).substring(2, 9), name: createdBy }],
    movies,
    votes: {},
    status: 'voting',
    createdAt: new Date().toISOString()
  };

  groups.set(groupId, group);

  return NextResponse.json(group);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get('id');

  if (groupId) {
    const group = groups.get(groupId);
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    return NextResponse.json(group);
  }

  return NextResponse.json({ error: 'Group ID required' }, { status: 400 });
}
