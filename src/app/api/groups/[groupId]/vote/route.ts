import { NextResponse } from 'next/server';

// In-memory storage (shared)
const groups = new Map();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const { groupId } = await params;
  const group = groups.get(groupId);

  if (!group) {
    return NextResponse.json({ error: 'Group not found' }, { status: 404 });
  }

  const { memberId, memberName, movieId } = await request.json();

  // Add member if new
  let member = group.members.find((m: any) => m.id === memberId);
  if (!member) {
    member = { id: memberId, name: memberName };
    group.members.push(member);
  }

  // Remove previous vote if exists
  if (member.vote) {
    group.votes[member.vote] = (group.votes[member.vote] || 0) - 1;
  }

  // Add new vote
  member.vote = movieId;
  group.votes[movieId] = (group.votes[movieId] || 0) + 1;

  // Check if all members voted and determine winner
  const allVoted = group.members.every((m: any) => m.vote);
  if (allVoted) {
    let maxVotes = 0;
    let winner = '';
    for (const [movie, votes] of Object.entries(group.votes)) {
      if (votes > maxVotes) {
        maxVotes = votes;
        winner = movie;
      }
    }
    group.winningMovie = winner;
  }

  groups.set(groupId, group);

  return NextResponse.json(group);
}
