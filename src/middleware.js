import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import User from "@/models/User"; // Adjust the import based on your structure
import { connectToDatabase } from "@/lib/connect";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {

  'use server'
  const { cookies, nextUrl } = req;
  const token = cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    await connectToDatabase();

    const user = await User.findById(payload.userId); // Ensure this is correct
    if (!user) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }

    // Attach user info to request
    req.user = user; 
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Error:", error.message);
    return NextResponse.redirect(new URL("/login", nextUrl));
  }
}

export const config = {
  matcher: ["/"], // Adjust this matcher as needed
};
