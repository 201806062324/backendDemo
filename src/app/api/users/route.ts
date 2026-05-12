import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        password,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating user:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
