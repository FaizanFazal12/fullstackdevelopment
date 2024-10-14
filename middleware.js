import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function middleware(req) {
  const token = req.cookies.get("token") || req.headers.get("Authorization");

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect("/login");
  }
}
