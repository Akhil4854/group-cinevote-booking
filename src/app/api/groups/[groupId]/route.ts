import { NextResponse } from 'next/server';

// In-memory storage (shared with route.ts)
const groups = new Map();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const { groupId } = await params;
  const group = groups.get(groupId);

  if (!group) {
    return NextResponse.json({ error: 'Group not found' }, { status: 404 });
  }

  return NextResponse.json(group);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const { groupId } = await params;
  const group = groups.get(groupId);

  if (!group) {
    return NextResponse.json({ error: 'Group not found' }, { status: 404 });
  }

  const body = await request.json();
  const updatedGroup = { ...group, ...body };
  groups.set(groupId, updatedGroup);

  return NextResponse.json(updatedGroup);
}
