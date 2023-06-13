"use client";

import { useAuth } from "@/lib/auth-context";

const Home = () => {
  const { connectedUser } = useAuth();

  return (
    <div className="p-16 flex-1 flex flex-col">
      <h2 className="text-2xl font-bold mb-4">
        Welcome back, {connectedUser?.firstName}!
      </h2>
      <div className="flex-1 flex flex-col gap-2">In construction 🚧</div>
    </div>
  );
};

export default Home;
