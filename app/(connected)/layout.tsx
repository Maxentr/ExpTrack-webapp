"use client";

import { Button } from "@/components/ui/button";
import withAuth from "@/components/withAuth";
import { useAuth } from "@/lib/auth-context";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import { PropsWithChildren } from "react";

const ConnectedLayout = ({ children }: PropsWithChildren) => {
  const { connectedUser, logout } = useAuth();

  return (
    <div className="flex-1 flex flex-col">
      <div className="fixed h-16 flex flex-row w-full py-2 px-8 border-b items-center justify-between">
        <div className="flex flex-row items-center gap-8">
          <h1 className="text-lg text-primary text-bold">
            <Link href="/home">ExpTrack</Link>
          </h1>
          <div className="flex flex-row items-center gap-4">
            <Link href="/home" className="text-base text-primary/90">Home</Link>
            <Link href="/groups">My groups</Link>
          </div>
        </div>
        <div className="flex flex-row items-center gap-4">
          <p className="text-right text-primary w-40 text-ellipsis whitespace-nowrap overflow-hidden">
            {connectedUser?.firstName} {connectedUser?.lastName}
          </p>
          <Button onClick={() => logout()} className="h-8" variant="ghost">
            <LogOutIcon size={24} color="black" />
          </Button>
        </div>
      </div>
      <div className="mt-16 h-[calc(100%-4rem)] flex flex-col p-0 overflow-y-auto">{children}</div>
    </div>
  );
};

export default withAuth(ConnectedLayout);
