"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NoExpenses = () => {
  const pathname = usePathname();

  return (
    <div className="mt-16 flex flex-1 flex-col justify-center text-center gap-4">
      <div>
        <p className="text-lg text-primary text-bold">
          There is no expense in this group.
        </p>
        <p className="text-lg text-primary text-bold">
          You can create one by clicking the button below.
        </p>
      </div>

      <Link href={`${pathname}/create-expense`}>
        <Button className="bg-primary">Create an expense</Button>
      </Link>
    </div>
  );
};

export default NoExpenses;
