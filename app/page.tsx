import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <h1 className="text-4xl font-bold mb-8 text-blue-800">Welcome to Job Application Tracker</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Manage your job applications, track your progress, and boost your career opportunities all in one place.
      </p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/auth/signin">Login</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/auth/signup">Register</Link>
        </Button>
      </div>
    </div>
  );
}