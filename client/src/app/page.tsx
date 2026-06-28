"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// The home page just sends people to the right place: logged-in users go
// to the dashboard, everyone else goes to the login page.
export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) {
      router.replace(user.role === "admin" ? "/admin" : "/dashboard");
    } else {
      router.replace("/login");
    }
  }, [user, loading, router]);

  return (
    <div className="flex flex-1 items-center justify-center p-10 text-zinc-500">
      Loading...
    </div>
  );
}
