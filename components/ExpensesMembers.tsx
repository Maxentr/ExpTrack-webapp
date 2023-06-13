import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { amountFormatter } from "@/lib/utils";
import { CustomExpenseMember } from "@/types/api";
import { X } from "lucide-react";
import React from "react";

export type ExpensesMembersOnChangeType = "update" | "delete";

export type ExpensesMembersOnChangeParams<
  T extends ExpensesMembersOnChangeType,
> = {
  members: CustomExpenseMember[];
  type: T;
  data: T extends "update" ? CustomExpenseMember : number;
};

export type ExpensesMembersOnChange = <T extends ExpensesMembersOnChangeType>(
  params: ExpensesMembersOnChangeParams<T>,
) => void;

type Props = {
  members: CustomExpenseMember[];
  onChange: ExpensesMembersOnChange;
};

const ExpensesMembers = ({ members, onChange }: Props) => {
  const onUpdate = (member: CustomExpenseMember) => {
    member.hasPaid = !member.hasPaid;

    const changedMembers = members.map((m) =>
      m.id === member.id ? member : m,
    );

    onChange({ members: changedMembers, type: "update", data: member });
  };

  const onDelete = (index: number) => {
    const { expenseMemberId } = members[index];
    const changedMembers = members.filter((_, i) => i !== index);

    onChange({
      members: changedMembers,
      type: "delete",
      data: expenseMemberId,
    });
  };

  if (!members.length) {
    return (
      <div className="text-center text-gray-500">
        No members have been added yet
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>amount</TableHead>
          <TableHead className="text-right">Has paid back</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-medium">
              {member.firstName} {member.lastName}
            </TableCell>
            <TableCell>{amountFormatter(member?.amount)}</TableCell>
            <TableCell className="text-right">
              <Switch
                checked={member.hasPaid}
                onClick={() => onUpdate(member)}
              />
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" className="ml-auto h-8 w-8 p-0">
                <X
                  onClick={() => onDelete(members.indexOf(member))}
                  className="text-red-500 cursor-pointer"
                />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ExpensesMembers;
