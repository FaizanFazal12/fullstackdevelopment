"use server"; // Ensure this runs in the server environment
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  // Return cached connection if it exists
  if (cached.conn) return cached.conn;

  // Create a new promise for connecting to the database if none exists
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).catch(err => {
      console.error("Database connection error:", err);
      throw err;
    });
  }

  // Await the promise and cache the connection
  cached.conn = await cached.promise;
  return cached.conn;
}
