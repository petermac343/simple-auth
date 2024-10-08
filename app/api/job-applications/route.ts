import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const [applications] = await query(
      'SELECT * FROM job_applications WHERE user_id = ? ORDER BY date_applied DESC',
      [userId]
    ) as any[];

    const count = applications.length;
    const latestApplication = applications[0];

    return NextResponse.json({ applications, count, latestApplication });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    return NextResponse.json({ error: 'An error occurred while fetching job applications' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const data = await req.json();
  const { userId, ...applicationData } = data;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const result = await query(
      'INSERT INTO job_applications (user_id, date_applied, company, job_title, source, job_link, job_type, salary_range, location, deadline, job_description, cv_used, cover_letter, status, points_to_note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, ...Object.values(applicationData)]
    );

    const newApplicationId = (result as any).insertId;

    return NextResponse.json({ message: 'Job application created successfully', application: { id: newApplicationId, ...applicationData, user_id: userId } });
  } catch (error) {
    console.error('Error creating job application:', error);
    return NextResponse.json({ error: 'An error occurred while creating the job application' }, { status: 500 });
  }
}