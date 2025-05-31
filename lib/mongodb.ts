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

if(!MONGODB_URI){
  throw new Error("Please add your Mongo URI to .env.local");
}

let cached = global.mongoose;

if(!cached){
  cached = global.mongoose = {conn:null,promise:null}
}

async function dbConnect(){
  if(cached.conn){
    return cached.conn;
  }
  if(!cached.promise){
    const opts = {
      bufferCommands:false,
      
    }
  cached.promise = mongoose.connect(MONGODB_URI!,opts).then((mongoose)=>{
    return mongoose;
  })
}
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;

