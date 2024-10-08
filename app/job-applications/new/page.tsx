"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function NewJobApplication() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [application, setApplication] = useState({
    company: '',
    job_title: '',
    date_applied: '',
    source: '',
    job_link: '',
    job_type: '',
    salary_range: '',
    location: '',
    deadline: '',
    job_description: '',
    cv_used: '',
    cover_letter: '',
    status: '',
    points_to_note: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApplication(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/job-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session?.user?.id, ...application }),
      });
      if (response.ok) {
        router.push('/job-applications');
      } else {
        throw new Error('Failed to create job application');
      }
    } catch (error) {
      console.error('Error creating job application:', error);
      alert('Failed to create job application');
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Job Application</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            value={application.company}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="job_title">Job Title</Label>
          <Input
            id="job_title"
            name="job_title"
            value={application.job_title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="date_applied">Date Applied</Label>
          <Input
            id="date_applied"
            name="date_applied"
            type="date"
            value={application.date_applied}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="source">Source</Label>
          <Input
            id="source"
            name="source"
            value={application.source}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="job_link">Job Link</Label>
          <Input
            id="job_link"
            name="job_link"
            value={application.job_link}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="job_type">Job Type</Label>
          <Input
            id="job_type"
            name="job_type"
            value={application.job_type}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="salary_range">Salary Range</Label>
          <Input
            id="salary_range"
            name="salary_range"
            value={application.salary_range}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={application.location}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="deadline">Deadline</Label>
          <Input
            id="deadline"
            name="deadline"
            type="date"
            value={application.deadline}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="job_description">Job Description</Label>
          <Textarea
            id="job_description"
            name="job_description"
            value={application.job_description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="cv_used">CV Used</Label>
          <Input
            id="cv_used"
            name="cv_used"
            value={application.cv_used}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="cover_letter">Cover Letter</Label>
          <Input
            id="cover_letter"
            name="cover_letter"
            value={application.cover_letter}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Input
            id="status"
            name="status"
            value={application.status}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="points_to_note">Points to Note</Label>
          <Textarea
            id="points_to_note"
            name="points_to_note"
            value={application.points_to_note}
            onChange={handleInputChange}
          />
        </div>
        <Button type="submit">Add Application</Button>
      </form>
    </div>
  );
}