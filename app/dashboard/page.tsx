"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applicationCount, setApplicationCount] = useState(0);
  const [latestApplication, setLatestApplication] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchApplicationData();
    }
  }, [session]);

  const fetchApplicationData = async () => {
    try {
      const response = await fetch(`/api/job-applications?userId=${session?.user?.id}`);
      const data = await response.json();
      setApplicationCount(data.count);
      setLatestApplication(data.latestApplication);
    } catch (error) {
      console.error('Error fetching application data:', error);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard, {session?.user?.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Job Applications</h2>
          <p>Total Applications: {applicationCount}</p>
          {latestApplication && (
            <div className="mt-2">
              <p>Latest Application:</p>
              <p>{latestApplication.company} - {latestApplication.job_title}</p>
              <p>Applied on: {new Date(latestApplication.date_applied).toLocaleDateString()}</p>
            </div>
          )}
          <Button asChild className="mt-4">
            <Link href="/job-applications">View All Applications</Link>
          </Button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Profile</h2>
          <p>Manage your personal information and preferences</p>
          <Button asChild className="mt-4">
            <Link href="/profile">Edit Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}