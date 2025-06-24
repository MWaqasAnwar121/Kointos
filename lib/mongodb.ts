// import { MongoClient } from 'mongodb';

// const uri = process.env.MONGODB_URI as string;
// const options = {
//   maxPoolSize: 10,
//   serverSelectionTimeoutMS: 5000,
//   socketTimeoutMS: 45000,
//   family: 4
// };

// declare global {
//   // eslint-disable-next-line no-var
//   var _mongoClientPromise: Promise<MongoClient> | undefined;
// }

// let client: MongoClient;
// let clientPromise: Promise<MongoClient>;

// if (!process.env.MONGODB_URI) {
//   throw new Error('Please add your Mongo URI to .env.local');
// }

// if (process.env.NODE_ENV === 'development') {
//   if (!globalThis._mongoClientPromise) {
//     client = new MongoClient(uri, options);
//     globalThis._mongoClientPromise = client.connect()
//       .then(client => {
//         console.log('MongoDB connected successfully');
//         return client;
//       })
//       .catch(error => {
//         console.error('MongoDB connection error:', error);
//         throw error;
//       });
//   }
//   clientPromise = globalThis._mongoClientPromise;
// } else {
//   client = new MongoClient(uri, options);
//   clientPromise = client.connect()
//     .then(client => {
//       console.log('MongoDB connected successfully');
//       return client;
//     })
//     .catch(error => {
//       console.error('MongoDB connection error:', error);
//       throw error;
//     });
// }

// export default clientPromise; 

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      retryReads: true,
    };

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    cached.promise = mongoose.connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

export default dbConnect;

