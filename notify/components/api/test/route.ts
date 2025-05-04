import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test database connection by running a simple query
    const result = await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'Database connection successful', result });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { status: 'Database connection failed', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 