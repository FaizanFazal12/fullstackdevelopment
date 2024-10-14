import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/connect";

const JWT_SECRET = process.env.JWT_SECRET;

console.log('JWT_SECRET',JWT_SECRET)
export async function middleware(req) {
  const { cookies, nextUrl } = req;
  // const token = cookies.get("token")?.value;
  const userId = cookies.get("user_id")?.value; // Get user ID from cookie
  if (!userId) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }
  // if (!token) {
  //   return NextResponse.redirect(new URL("/login", nextUrl));
  // }

  // try {
  //   // const decoded = jwt.verify(token, JWT_SECRET);
  //   await connectToDatabase();

  //   const user = await User.findById(userId);

  //   if (!user) {
  //     return NextResponse.redirect(new URL("/login", nextUrl));
  //   }

  //   req.user = user;
  //   return NextResponse.next();
  // } catch (error) {
  //   console.error("Middleware Error:", error.message);
  //   return NextResponse.redirect(new URL("/login", nextUrl));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
