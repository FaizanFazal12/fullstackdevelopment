import Todo from "@/components/Todo";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth"; // Make sure this function is properly implemented
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;


  if (!token || !verifyToken(token)) {
    redirect("/login"); 
  }

  

  return (
    <div>
  <h1 className="text-2xl font-bold text-center my-10">Welcome to Your Todo App</h1>
  
  <Todo />

  <p className="text-center my-4 text-lg text-gray-700">
    To view all your tasks, click the button below. You'll be taken to a list where you can manage your todos!
  </p>

  <Link href="/todos" className="block text-center  text-indigo-500 hover:underline mt-4">
    Show all todos
  </Link>
</div>
  );
}
