import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { amountFormatter, fetcher } from "@/lib/utils";
import { Expense, ExpenseWithMembers } from "@/types/api";
import React from "react";
import useSWR from "swr";

type Props = {
  groupId: number;
};

const Dashboard = ({ groupId }: Props) => {
  const { connectedUser } = useAuth();
  const {
    data: expenses,
    error,
    mutate,
  } = useSWR<ExpenseWithMembers[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/groups/${groupId}/member/1`,
    fetcher,
    { suspense: true },
  );

  const expensesWithConnectedUser = expenses?.map((expense) => {
    const expenseMember = expense.members?.find(
      (member) => member.userId === connectedUser?.id,
    );

    return {
      ...expense,
      expenseMember,
    };
  });

  const totalAmount = expensesWithConnectedUser?.reduce(
    (acc, expense) => acc + (expense?.expenseMember?.amount || 0),
    0,
  );

  const Expenses = () => (
    <>
      <h4 className="text-lg">Expenses you need to pay:</h4>
      {expensesWithConnectedUser?.map((expense) => (
        <Card key={expense.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{expense.name}</CardTitle>
            <CardDescription>
              {amountFormatter(expense.expenseMember?.amount || 0)}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </>
  );

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col flex-1 gap-2 p-2">
        <div className="flex flex-row justify-between items-center mb-4">
          <h3 className="text-xl">
            You owe{" "}
            <span className="font-bold">
              {totalAmount && totalAmount > 0
                ? amountFormatter(totalAmount)
                : "nothing"}{" "}
            </span>
            to the group
          </h3>
        </div>
        <div className="flex flex-col flex-1 gap-2">
          {expensesWithConnectedUser && expensesWithConnectedUser.length > 0 ? (
            <Expenses />
          ) : (
            <div className="flex flex-1 flex-col justify-center text-center gap-4">
              <p className="text-lg text-primary text-bold">
                You don&apos;t have any expenses to pay off
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
