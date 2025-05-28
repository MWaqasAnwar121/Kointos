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

  switch (req.method) {
    case 'GET':
      // List all articles
      return res.status(200).json(articles);

    case 'POST':
      // Create new article
      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { title, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const newArticle = {
        id: Date.now().toString(), // Simple ID generation
        title,
        content,
        authorId: session.user?.id || 'anonymous',
        authorName: session.user?.name || 'Anonymous',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      articles.push(newArticle);
      return res.status(201).json(newArticle);

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 