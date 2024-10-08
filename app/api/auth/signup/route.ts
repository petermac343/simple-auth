import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    const hashedPassword = await hash(password, 12);

    const result = await query(
      'INSERT INTO users (user_name, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    const userId = (result as any).insertId;

    return NextResponse.json({ message: 'User created successfully', user: { id: userId, email } });
  } catch (error) {
    console.error('Error in signup:', error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}