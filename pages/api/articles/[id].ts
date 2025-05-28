import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

// In-memory storage for articles (replace with database in production)
let articles = [
  {
    id: '1',
    title: 'The Rise of Decentralized Finance',
    content: 'DeFi is revolutionizing financial services. It leverages blockchain technology to remove intermediaries like banks from financial transactions.',
    authorId: 'user1',
    authorName: 'Alice',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Understanding NFTs',
    content: 'Non-fungible tokens (NFTs) are unique digital assets that represent ownership of a specific item or piece of content.',
    authorId: 'user2',
    authorName: 'Bob',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  const { id } = req.query;

  // Find the article
  const articleIndex = articles.findIndex(article => article.id === id);

  if (articleIndex === -1) {
    return res.status(404).json({ error: 'Article not found' });
  }

  const article = articles[articleIndex];

  switch (req.method) {
    case 'GET':
      // Get single article
      return res.status(200).json(article);

    case 'PUT':
      // Update article
      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Check if user is the author
      if (article.authorId !== session.user?.id) {
        return res.status(403).json({ error: 'Forbidden - You can only edit your own articles' });
      }

      const { title, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const updatedArticle = {
        ...article,
        title,
        content,
        updatedAt: new Date().toISOString(),
      };

      articles[articleIndex] = updatedArticle;
      return res.status(200).json(updatedArticle);

    case 'DELETE':
      // Delete article
      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Check if user is the author
      if (article.authorId !== session.user?.id) {
        return res.status(403).json({ error: 'Forbidden - You can only delete your own articles' });
      }

      articles = articles.filter(article => article.id !== id);
      return res.status(204).end();

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 