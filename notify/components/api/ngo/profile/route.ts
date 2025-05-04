import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET endpoint to fetch NGO profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const ngo = await db.ngo.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        organizationName: true,
        isVerified: true,
        verificationStatus: true,
      },
    });

    if (!ngo) {
      return NextResponse.json(
        { error: "NGO not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(ngo);
  } catch (error) {
    console.error("Error fetching NGO profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update NGO profile
export async function PATCH(req: Request) {
  try {
    const { userId, ...updateData } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const updatedProfile = await prisma.ngoProfile.update({
      where: {
        userId: userId,
      },
      data: {
        ...updateData,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating NGO profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 