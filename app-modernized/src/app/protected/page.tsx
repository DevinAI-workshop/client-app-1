'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthHeader } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function ProtectedPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [data, setData] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?next=/protected');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProtectedData();
    }
  }, [isAuthenticated]);

  const fetchProtectedData = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(`${API_URL}/getData/`, {
        credentials: 'include',
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error('Error fetching protected data:', error);
    } finally {
      setIsFetching(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <>
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold text-gray-900">Loading...</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isFetching ? (
          <h1 className="text-2xl font-bold text-gray-900">Loading data...</h1>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome back, {user?.userName}!</h1>
            <h3 className="text-xl text-gray-600">{data}</h3>
          </div>
        )}
      </div>
    </>
  );
}
