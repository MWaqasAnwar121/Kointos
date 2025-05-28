"use client";
import { useSession, signOut } from "next-auth/react";

export default function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;
  if (!session) return null;

  return (
    <div className="flex items-center space-x-4">
      <span className="text-gray-700 dark:text-gray-200 text-sm">
        {session.user?.username || session.user?.email}
      </span>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  );
} 