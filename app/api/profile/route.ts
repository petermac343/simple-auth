import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const [profiles] = await query('SELECT * FROM profiles WHERE user_id = ?', [userId]) as any[];
    const profile = profiles[0] || {};
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'An error occurred while fetching the profile' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const data = await req.json();
  const { userId, ...profileData } = data;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const [existingProfiles] = await query('SELECT * FROM profiles WHERE user_id = ?', [userId]) as any[];
    const existingProfile = existingProfiles[0];

    if (existingProfile) {
      await query(
        'UPDATE profiles SET about_me = ?, industrial_field = ?, preferred_locations = ?, preferred_job_titles = ?, race = ?, resume_path = ?, coverletter_path = ?, salary_expectations = ?, work_environment_preference = ? WHERE user_id = ?',
        [...Object.values(profileData), userId]
      );
    } else {
      await query(
        'INSERT INTO profiles (user_id, about_me, industrial_field, preferred_locations, preferred_job_titles, race, resume_path, coverletter_path, salary_expectations, work_environment_preference) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, ...Object.values(profileData)]
      );
    }

    return NextResponse.json({ message: 'Profile updated successfully', profile: { ...profileData, user_id: userId } });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'An error occurred while updating the profile' }, { status: 500 });
  }
}