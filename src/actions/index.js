"use server";
import { cookies } from "next/headers";
import { comparePassword, generateToken, setTokenCookie, hashPassword, verifyToken } from "@/lib/auth";

import Todo from "@/models/Todo";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();




export async function createTodo(formData) {
  const title = formData.get("title");
  const description = formData.get("description");
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  const decoded = verifyToken(token);
  if (!decoded) {
    throw new Error("User is not authenticated.");
  }

  try {
    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        userId: decoded.userId, // Link to the user from the token
      },
    });

    return { success: true, message: "Todo created successfully!", todo };
  } catch (error) {
    console.error("Error creating todo:", error);
    throw new Error("Error creating todo. Please try again.");
  }
}

export async function getTodo(formData) {

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  const decoded = verifyToken(token);
  if (!decoded) {
    throw new Error("User is not authenticated.");
  }

  try {
    const todo = await prisma.todo.findUnique({where:{id:decoded.userId}});
    return todo

  } catch (error) {
    console.error("Error creating todo:", error);
    throw new Error("Error creating todo. Please try again.");
  }
}
export async function getUserToken() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value
  console.log(token  )

  if(!token){
    return null
  }
  
  const decoded = verifyToken(token);
  if(!decoded){
    return  null;
  }

  console.log(decoded)

  const user = await prisma.user.findUnique({where:{id:decoded.userId}});

  console.log(user  )
  if(!user){
    return  null;
  }

  return user
}
export async function deleteUserToken() {
  const cookieStore = cookies();
  const token = cookieStore.delete("token")?.value;
  return token || null;
}
export async function getAllTodos() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  const decoded = verifyToken(token);

  const todos = await prisma.todo.findMany({ where: { userId:decoded.userId } });


  return todos;
}
export async function updateTodo(id, { title, description }) {
  try {
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { title, description },
    });
    return updatedTodo;
  } catch (error) {
    console.error("Error updating todo:", error);
    throw new Error("Unable to update todo");
  }
}

export async function deleteTodo(id) {
  try {
    await prisma.todo.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw new Error("Unable to delete todo");
  }
}
export async function loginUser(formData) {
  const email = formData.get("email")
  const password = formData.get("password")

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  const token = generateToken(user.id);
  setTokenCookie(token); // Store token in cookie
  return { success: true, message: "Login successful!" };

}
export async function signupUser(formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");

  const checkemailexist = await prisma.user.findUnique({ where: { email } });
  if (checkemailexist) throw new Error("Email is already taken");

  const hashpassword = await hashPassword(password);

  const user = await prisma.user.create({data: {
    email,
    password: hashpassword,
    name: name
  }})

  const token = generateToken(user.id);
  setTokenCookie(token); 
  return { success: true, message: "User registered successful!" }

}
