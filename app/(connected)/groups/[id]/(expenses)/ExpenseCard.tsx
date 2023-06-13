"use client";

import { CustomExpenseMember, Expense, ExpenseMember } from "@/types/api";
import useSWR from "swr";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ExpensesMembers, {
  ExpensesMembersOnChangeParams,
  ExpensesMembersOnChangeType,
} from "@/components/ExpensesMembers";
import { amountFormatter, fetcher } from "@/lib/utils";
import { Suspense, useState } from "react";
import { Trash } from "lucide-react";
import DeleteExpense from "@/app/(connected)/groups/[id]/(expenses)/DeleteExpense";
import { Button } from "@/components/ui/button";
import axios, { AxiosResponse, HttpStatusCode } from "axios";

type Props = {
  expense: Expense;
  onDeletion: () => void;
};

const ExpenseCard = ({ expense, onDeletion }: Props) => {
  const {
    data: members,
    error,
    mutate,
  } = useSWR<CustomExpenseMember[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/expenses/${expense.id}/members`,
    fetcher,
    { suspense: true },
  );

  const [openDeletion, setOpenDeletion] = useState(false);

  const handleMembersChange = async <T extends ExpensesMembersOnChangeType>({
    members,
    type,
    data,
  }: ExpensesMembersOnChangeParams<T>) => {
    let response: AxiosResponse | null = null;
    if (type === "update") {
      response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/expenses-members/${
          (data as CustomExpenseMember)?.expenseMemberId
        }`,
        data,
      );
    } else if (type === "delete") {
      response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/expenses-members/${data}`,
      );
    }

    if (response && response?.status === HttpStatusCode.Ok) {
      mutate(members);
    }
  };

  const handleExpenseDeletion = () => {
    setOpenDeletion(false);
    onDeletion();
  };

  return (
    <>
      <AccordionItem value={expense.id.toString()}>
        <AccordionTrigger>
          <div className="w-full flex flex-row items-center justify-between pr-4">
            <div className="flex flex-col items-start">
              <p className="text-lg">{expense.name}</p>
              <p className="text-sm text-gray-500">
                {new Date(expense.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-row items-center gap-6">
              <p className="text-sm text-gray-500">
                {amountFormatter(expense.amount)}
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="border-t border-gray-100 pt-4">
          <div className="flex flex-row justify-between">
            <p>{expense.description}</p>
            <Button variant="ghost" onClick={() => setOpenDeletion(true)}>
              <Trash className="w-6 h-6 text-red-500 hover:text-red-600 cursor-pointer" />
            </Button>
          </div>
          <p className="mt-4 font-semibold">Members</p>
          <Suspense fallback={<div>Loading...</div>}>
            <ExpensesMembers
              members={members || []}
              onChange={handleMembersChange}
            />
          </Suspense>
        </AccordionContent>
      </AccordionItem>
      <DeleteExpense
        expenseId={expense.id}
        open={openDeletion}
        onClose={handleExpenseDeletion}
      />
    </>
  );
};

export default ExpenseCard;
