"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="w-full flex justify-between items-center p-4 bg-gray-100 shadow">
      <Link href="/" className="text-xl font-bold">
        SmartClinic
      </Link>

      <div className="space-x-4">
        {!session?.user ? (
          <>
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="text-gray-700">Hi, {session.user.name}</span>
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
