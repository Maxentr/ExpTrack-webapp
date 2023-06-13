"use client";

import Groups from "./Groups";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="p-16 flex-1 flex flex-col">
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold mb-4">Your groups</h2>
        <Link href="/groups/create">
          <Button className="bg-primary">Create a group</Button>
        </Link>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <Groups />
      </div>
    </div>
  );
}
