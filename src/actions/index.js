"use server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/connect";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Todo from "@/models/Todo";

const JWT_SECRET = process.env.JWT_SECRET;

export async function createTodo(formData) {
  const name = formData.get("name");
  const description = formData.get("description");

  try {
    // Connect to the database
    await connectToDatabase();

    // Retrieve user ID from cookies
    const userId = cookies().get("user_id")?.value;

    if (!name || !description) {
      throw new Error("All fields are required");
    }

    if (!userId) {
      throw new Error("User is not authenticated.");
    }

    await Todo.create({
      name,
      description,
      user: userId,
    });

    return { success: true , message: "Todo Created successfully" };
  } catch (error) {
    console.error("Create Todo Error:", error.message);
    throw new Error(
      error.message || "Something went wrong while creating the Todo."
    );
  }
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

  cookies().set({
    name: "user_id",
    value: newUser._id.toString(), // Store user ID as a string
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 24 * 60 * 60, // 1 day
  });

  //   // Generate JWT token
  // const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "1d" });

  //   cookies().set({
  //     name: "token",
  //     value: token,
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === "production",
  //     sameSite: "strict",
  //     path: "/", // Make it accessible site-wide
  //     maxAge: 24 * 60 * 60, // 1 day
  //   });

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

  cookies().set({
    name: "user_id",
    value: user._id.toString(), // Store user ID as a string
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 24 * 60 * 60, // 1 day
  });
  // Generate a JWT token
  // const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

  // cookies().set({
  //   name: "token",
  //   value: token,
  //   httpOnly: true, // Prevent access via JavaScript (secure)
  //   secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  //   sameSite: "strict", // Prevent CSRF attacks
  //   path: "/", // Make it accessible site-wide
  //   maxAge: 24 * 60 * 60, // 1 day
  // });

  return { success: true, message: "Login successful!" };
}
