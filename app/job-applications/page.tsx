"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

interface JobApplication {
  id: number;
  company: string;
  job_title: string;
  date_applied: string;
  status: string;
}

export default function JobApplications() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user?.id) {
      fetchApplications();
    }
  }, [status, router, session]);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`/api/job-applications?userId=${session?.user?.id}`);
      const data = await response.json();
      setApplications(data.applications);
    } catch (error) {
      console.error('Error fetching job applications:', error);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Job Applications</h1>
      <Button asChild className="mb-4">
        <Link href="/job-applications/new">Add New Application</Link>
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Date Applied</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell>{app.company}</TableCell>
              <TableCell>{app.job_title}</TableCell>
              <TableCell>{new Date(app.date_applied).toLocaleDateString()}</TableCell>
              <TableCell>{app.status}</TableCell>
              <TableCell>
                <Button asChild size="sm">
                  <Link href={`/job-applications/${app.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}