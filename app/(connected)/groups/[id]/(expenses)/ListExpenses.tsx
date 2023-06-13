"use client";

import { Expense } from "@/types/api";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { Suspense } from "react";
import ExpenseCard from "./ExpenseCard";
import NoExpenses from "./Empty";
import ExpensesSkeleton from "./Loading";
import Link from "next/link";
import { Accordion } from "@/components/ui/accordion";

type Props = {
  groupId: number;
  selectedExpenseId?: string;
};

const ListExpenses = ({ groupId, selectedExpenseId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    data: expenses,
    error,
    mutate,
  } = useSWR<Expense[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/expenses/group/${groupId}`,
    fetcher,
    { suspense: true },
  );

  const handleExpenseDeletion = () => {
    mutate();
  };

  return (
    <div className="-mt-16 w-full flex flex-col">
      <div className="flex justify-end mb-4">
        {expenses && expenses.length > 0 && (
          <Link href={`${pathname}/create-expense`}>
            <Button className="bg-primary">Create an expense</Button>
          </Link>
        )}
      </div>
      <Suspense fallback={<ExpensesSkeleton />}>
        {expenses && expenses.length > 0 ? (
          <Accordion type="multiple" defaultValue={[selectedExpenseId || ""]}>
            {expenses.map((expense) => (
              <ExpenseCard
                expense={expense}
                key={expense.id}
                onDeletion={handleExpenseDeletion}
              />
            ))}
          </Accordion>
        ) : (
          <NoExpenses />
        )}
      </Suspense>
    </div>
  );
};

export default ListExpenses;
