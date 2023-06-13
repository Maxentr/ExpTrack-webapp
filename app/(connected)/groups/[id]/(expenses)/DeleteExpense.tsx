"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import axios, { HttpStatusCode } from "axios";
import { toast } from "@/components/ui/use-toast";

type Props = {
  expenseId: number;
  open: boolean;
  onClose: () => void;
};

const DeleteExpense = ({ expenseId, open, onClose }: Props) => {
  const onDelete = async () => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/expenses/${expenseId}`,
    );

    if (response.status === HttpStatusCode.Ok) {
      toast({
        title: "Expense deleted",
        description: "The expense has been deleted.",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete the expense</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the expense?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteExpense;
