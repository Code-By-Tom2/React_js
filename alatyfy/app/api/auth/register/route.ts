import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import * as z from 'zod';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with NGO profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the user first
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'NGO',
        },
      });

      // Create the NGO profile
      const ngoProfile = await tx.ngoProfile.create({
        data: {
          name,
          description: '', // Can be updated later
          donationTarget: 0, // Can be updated later
          userId: user.id,
        },
      });

      return { user, ngoProfile };
    });

    // Don't send the password in the response
    const { password: _, ...userWithoutPassword } = result.user;

    return NextResponse.json({
      user: userWithoutPassword,
      ngoProfile: result.ngoProfile,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 