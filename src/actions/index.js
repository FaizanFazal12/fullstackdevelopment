'use server'
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/connect";
import { cookies } from "next/headers"; 
import jwt from 'jsonwebtoken'
 
const JWT_SECRET = process.env.JWT_SECRET;

export async function createTodo(formData) {

    console.log(formData);
  
}
export async function authenticate(formData) {

    console.log(formData);
  
}

export async function signupUser(formData) {
    "use server"; 
  
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
  
    await connectToDatabase();
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists!");
    }
  
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();


      // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "1d" });

      cookies().set({
        name: "token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "strict",
        path: "/", // Make it accessible site-wide
        maxAge: 24 * 60 * 60, // 1 day
      });

    
  
    return { success: true, message: "User registered successfully!" };
  }



export async function loginUser(formData) {

  const email = formData.get("email");
  const password = formData.get("password");

  await connectToDatabase();

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password!");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password!");
  }

  // Generate a JWT token
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

  cookies().set({
    name: "token",
    value: token,
    httpOnly: true, // Prevent access via JavaScript (secure)
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    path: "/", // Make it accessible site-wide
    maxAge: 24 * 60 * 60, // 1 day
  });

  return { success: true, token, message: "Login successful!" };
}