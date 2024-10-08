"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState({
    about_me: '',
    industrial_field: '',
    preferred_locations: '',
    preferred_job_titles: '',
    race: '',
    resume_path: '',
    coverletter_path: '',
    salary_expectations: '',
    work_environment_preference: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user?.id) {
      fetchProfile();
    }
  }, [status, router, session]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/profile?userId=${session?.user?.id}`);
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session?.user?.id, ...profile }),
      });
      if (response.ok) {
        alert('Profile updated successfully');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="about_me">About Me</Label>
          <Textarea
            id="about_me"
            name="about_me"
            value={profile.about_me}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="industrial_field">Industrial Field</Label>
          <Input
            id="industrial_field"
            name="industrial_field"
            value={profile.industrial_field}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="preferred_locations">Preferred Locations</Label>
          <Input
            id="preferred_locations"
            name="preferred_locations"
            value={profile.preferred_locations}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="preferred_job_titles">Preferred Job Titles</Label>
          <Input
            id="preferred_job_titles"
            name="preferred_job_titles"
            value={profile.preferred_job_titles}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="race">Race</Label>
          <Input
            id="race"
            name="race"
            value={profile.race}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="resume_path">Resume Path</Label>
          <Input
            id="resume_path"
            name="resume_path"
            value={profile.resume_path}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="coverletter_path">Cover Letter Path</Label>
          <Input
            id="coverletter_path"
            name="coverletter_path"
            value={profile.coverletter_path}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="salary_expectations">Salary Expectations</Label>
          <Input
            id="salary_expectations"
            name="salary_expectations"
            value={profile.salary_expectations}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="work_environment_preference">Work Environment Preference</Label>
          <Input
            id="work_environment_preference"
            name="work_environment_preference"
            value={profile.work_environment_preference}
            onChange={handleInputChange}
          />
        </div>
        <Button type="submit">Update Profile</Button>
      </form>
    </div>
  );
}