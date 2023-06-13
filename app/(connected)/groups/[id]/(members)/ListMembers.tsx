"use client";

import React, { Suspense } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import { User } from "@/types/api";
import axios, { HttpStatusCode } from "axios";
import { UserMinus } from "lucide-react";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import AddMember from "./AddMember";

type Props = {
  groupId: number;
};

const ListMembers = ({ groupId }: Props) => {
  const { connectedUser } = useAuth();
  const {
    data: members,
    error,
    mutate,
  } = useSWR<User[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/groups/${groupId}/members`,
    fetcher,
    { suspense: true },
  );

  let selectedMemberId: number | null = null;

  const onDelete = async () => {
    if (selectedMemberId === null) return;
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/groups/${groupId}/${selectedMemberId}`,
    );

    if (response.status === HttpStatusCode.Ok) {
      toast({
        title: "Member removed",
        description: "The member has been removed from the group.",
      });
      mutate();
    }
    selectedMemberId = null;
  };

  return (
    <div className="-mt-16">
      <div className="flex justify-end mb-4">
        <AddMember groupId={groupId} />
      </div>
      <AlertDialog>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First name</TableHead>
              <TableHead>Last name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <Suspense fallback={<TableSkeleton />}>
              {members?.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.firstName}
                  </TableCell>
                  <TableCell className="font-medium">
                    {member.lastName}
                  </TableCell>
                  <TableCell className="font-medium">{member.email}</TableCell>
                  <TableCell className="text-right">
                    {connectedUser?.email !== member.email && (
                      <AlertDialogTrigger
                        onClick={() => (selectedMemberId = member.id)}
                      >
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <UserMinus className="text-red-500 cursor-pointer ml-auto" />
                        </Button>
                      </AlertDialogTrigger>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </Suspense>
          </TableBody>
        </Table>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member from group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this member from the group?
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
    </div>
  );
};

const TableSkeleton = () => (
  <>
    {Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton className="h-8 w-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-8 w-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-8 w-full" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="ml-auto h-8 w-8" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

export default ListMembers;
