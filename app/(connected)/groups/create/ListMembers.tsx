import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth-context";
import { X } from "lucide-react";
import React from "react";

type Props = {
  members: string[];
  onDelete: (id: number) => void;
};

const ListMembers = ({ members, onDelete }: Props) => {
  const { connectedUser } = useAuth();

  return (
    <Table className="w-5/12">
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member}>
            <TableCell className="font-medium">{member}</TableCell>
            <TableCell className="text-right">
              {connectedUser?.email !== member && (
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <X
                    onClick={() => onDelete(members.indexOf(member))}
                    className="text-red-500 cursor-pointer ml-auto"
                  />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ListMembers;
