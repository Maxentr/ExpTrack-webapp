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
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

type Props = {
  groupId: number;
  open: boolean;
  onClose: () => void;
};

const LeaveGroupAlertDialog = ({ groupId, open, onClose }: Props) => {
  const { connectedUser } = useAuth();
  const router = useRouter();

  const onDelete = async () => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/groups/${groupId}/${connectedUser?.id}`,
    );

    if (response.status === HttpStatusCode.Ok) {
      router.push("/groups");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave the group</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to leave the group?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600"
          >
            Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LeaveGroupAlertDialog;
