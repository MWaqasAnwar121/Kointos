import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Attempting to connect to MongoDB...');
    const client = await clientPromise;
    console.log('MongoDB client created');
    
    const db = client.db();
    console.log('Database connection established');
    
    // List all collections to verify database access
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Test the connection
    await db.command({ ping: 1 });
    console.log('Ping successful');
    
    res.status(200).json({ 
      status: 'Connected to MongoDB!',
      database: db.databaseName,
      collections: collections.map(c => c.name)
    });
  } catch (error: any) {
    console.error('Detailed MongoDB connection error:', {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      stack: error?.stack
    });
    res.status(500).json({ 
      error: 'Failed to connect to MongoDB',
      details: error?.message,
      code: error?.code
    });
  }
} 