'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Article {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

const EditArticlePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const articleId = params?.id as string | undefined;
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      const currentPath = window.location.pathname;
      router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [status, router]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) {
        setError('Article ID is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/articles/${articleId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }
        const data = await response.json();

        // Check if user is the author
        if (data.userId !== session?.user?.id) {
          throw new Error('You are not authorized to edit this article');
        }

        setTitle(data.title);
        setContent(data.content);
        setAuthorName(data.authorName);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchArticle();
    }
  }, [articleId, session, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !authorName || !content ) {
      setError('Please fill in all fields.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: session?.user?.id,
          title, 
          authorName,
          content,
          
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update article');
      }

      router.push(`/articles/${articleId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600 dark:text-gray-300">Loading article...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 dark:text-red-400">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Edit Article</h1>
      
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10 space-y-8">
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg relative mb-8" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="space-y-8">
          <div>
            <label htmlFor="title" className="block text-xl font-bold text-gray-900 dark:text-white mb-3">Title</label>
            <input
              type="text"
              id="title"
              className="input mt-1 block w-full px-5 py-4 text-lg font-semibold border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="authorName" className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Author Name</label>
            <input
              type="text"
              id="authorName"
              className="input mt-1 block w-full px-5 py-4 text-base font-medium border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-3">Content</label>
            <textarea
              id="content"
              rows={14}
              className="input mt-1 block w-full px-5 py-4 text-base border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
        </div>
        
        <div className="flex items-center justify-end pt-6">
          <button
            type="submit"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArticlePage; 
