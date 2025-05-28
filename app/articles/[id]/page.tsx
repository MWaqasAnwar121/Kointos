'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
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

const ArticlePage: React.FC = () => {
  const params = useParams();
  const { data: session } = useSession();
  const articleId = params?.id as string | undefined;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
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
        setArticle(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (loading) {
    return <div className="text-center text-gray-600 dark:text-gray-300">Loading article...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 dark:text-red-400">Error: {error}</div>;
  }

  if (!article) {
    return <div className="text-center text-gray-600 dark:text-gray-300">Article not found.</div>;
  }

  const isAuthor = session?.user?.id === article.authorId;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{article.title}</h1>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        By {article.authorName} | Published on {new Date(article.createdAt).toLocaleDateString()}
      </p>
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300">{article.content}</p>
      </div>
      {isAuthor && (
        <div className="mt-6 text-right">
          <Link 
            href={`/articles/${article.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit Article
          </Link>
        </div>
      )}
    </div>
  );
};

export default ArticlePage; 