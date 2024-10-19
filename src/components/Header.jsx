"use client"; 
import { getUserToken  ,deleteUserToken} from "@/actions";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();


  useEffect(() => {
    getUserToken().then((token) => {
      setIsLoggedIn(!!token);
    });
  }, []);

  const handleLogout = () => {
     deleteUserToken();
    setIsLoggedIn(false);
    router.push('/login')

  };

  return (
    <header className="text-gray-600 body-font shadow-md bg-white">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        {/* Logo */}
        <Link href="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl font-bold">Todos</span>
        </Link>

        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <Link href="/todos" className="mr-5 hover:text-indigo-500">
            Todos
          </Link>
        </nav>

        {!isLoggedIn ? (
          <div className="flex space-x-4">
            <Link href="/login">
              <button className="inline-flex items-center bg-indigo-500 text-white border-0 py-2 px-4 focus:outline-none hover:bg-indigo-600 rounded text-base">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="inline-flex items-center bg-green-500 text-white border-0 py-2 px-4 focus:outline-none hover:bg-green-600 rounded text-base">
                Signup
              </button>
            </Link>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="inline-flex items-center bg-red-500 text-white border-0 py-2 px-4 focus:outline-none hover:bg-red-600 rounded text-base"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
