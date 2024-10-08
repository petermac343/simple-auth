import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const [applications] = await query(
      'SELECT * FROM job_applications WHERE id = ? AND user_id = ?',
      [params.id, userId]
    ) as any[];

    const application = applications[0];

    if (!application) {
      return NextResponse.json({ error: 'Job application not found' }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error fetching job application:', error);
    return NextResponse.json({ error: 'An error occurred while fetching the job application' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const { userId, ...applicationData } = data;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const result = await query(
      'UPDATE job_applications SET date_applied = ?, company = ?, job_title = ?, source = ?, job_link = ?, job_type = ?, salary_range = ?, location = ?, deadline = ?, job_description = ?, cv_used = ?, cover_letter = ?, status = ?, points_to_note = ? WHERE id = ? AND user_id = ?',
      [...Object.values(applicationData), params.id, userId]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: 'Job application not found or user not authorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Job application updated successfully', application: { id: params.id, ...applicationData, user_id: userId } });
  } catch (error) {
    console.error('Error updating job application:', error);
    return NextResponse.json({ error: 'An error occurred while updating the job application' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const result = await query(
      'DELETE FROM job_applications WHERE id = ? AND user_id = ?',
      [params.id, userId]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: 'Job application not found or user not authorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Job application deleted successfully' });
  } catch (error) {
    console.error('Error deleting job application:', error);
    return NextResponse.json({ error: 'An error occurred while deleting the job application' }, { status: 500 });
  }
}