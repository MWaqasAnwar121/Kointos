'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FetchAllArticles, DeleteArticleById } from '@/actions';

interface Article {
  _id: string;
  title: string;
  content: string;
  userId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      const data = await FetchAllArticles();
      if (data.success && data.articles) {
        setArticles(data.articles);
      } else {
        setArticles([]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (articleId: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    setDeletingId(articleId);
    try {
      const res = await DeleteArticleById({ articleId });
      if (res.success) {
        setArticles(prev => prev.filter(a => a._id !== articleId));
      } else {
        alert(res.message || 'Failed to delete article.');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete article.');
    } finally {
      setDeletingId(null);
    }
  };

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
        {articles.map(article => {
          const isOwner = session?.user && (article.userId === session.user.id || article.userId === session.user._id);
          return (
            <div key={article._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <Link href={`/articles/${article._id}`} className="hover:underline">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{article.title}</h2>
                </Link>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">{article.content}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">By {article.authorName}</p>
                {isOwner && (
                  <div className="flex space-x-2 mt-2">
                    <Link
                      href={`/articles/${article._id}/edit`}
                      className="px-3 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(article._id)}
                      className="px-3 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                      disabled={deletingId === article._id}
                    >
                      {deletingId === article._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArticlesPage; 