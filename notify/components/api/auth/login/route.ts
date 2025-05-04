import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // TODO: Replace with actual authentication logic
    // For now, accept any email/password combination
    if (email && password) {
      // Generate a default organization name from email
      const defaultName = email.split('@')[0]
        .split('.')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return NextResponse.json({
        user: {
          id: '1',
          email: email,
          name: defaultName, // Use this as a default name
          role: 'ngo'
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 