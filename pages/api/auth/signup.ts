import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { hash } from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, password, username } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const client = await clientPromise;
    const users = client.db().collection('users');
    const existing = await users.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await hash(password, 10);
    await users.insertOne({ email, hashedPassword, username });
    return res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error('Signup API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 