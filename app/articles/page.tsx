'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        setArticles(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600 dark:text-gray-300">Loading articles...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 dark:text-red-400">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Articles</h1>
      
      {/* Link to create a new article - will conditionally show for authenticated users later */}
      <div className="text-right mb-6">
        <Link href="/articles/new" className="btn-primary">
          Create New Article
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <div key={article.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <Link href={`/articles/${article.id}`} className="hover:underline">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{article.title}</h2>
              </Link>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">{article.content}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">By {article.authorName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesPage; 