import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      organizationName,
      registrationNumber,
      address,
      contactPerson,
      phoneNumber,
      website,
      description,
    } = body;

    // Validate required fields
    if (!organizationName || !registrationNumber || !address || !contactPerson || !phoneNumber || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update NGO profile with verification details
    const ngo = await db.ngo.update({
      where: { email: session.user.email },
      data: {
        organizationName,
        registrationNumber,
        address,
        contactPerson,
        phoneNumber,
        website,
        description,
        isVerified: false, // Set to false initially, admin will verify
        verificationStatus: 'PENDING',
      },
    });

    return NextResponse.json(ngo);
  } catch (error) {
    console.error('Error in NGO verification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 