"use client";

import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, LogOut, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import LeaveGroupAlertDialog from "./LeaveGroup";
import EditGroup from "./EditGroup";
import { Group } from "@/types/api";
import { Dialog } from "@/components/ui/dialog";

type Props = {
  group: Group;
};

const DropdownParameters = ({ group }: Props) => {
  const [open, setOpen] = useState(false);
  const [openEditGroup, setOpenEditGroup] = useState(false);
  const [openLeaveGroup, setOpenLeaveGroup] = useState(false);

  return (
    <Dialog open={openEditGroup} onOpenChange={setOpenEditGroup}>
      <DropdownMenu open={open} onOpenChange={() => setOpen(false)}>
        <DropdownMenuTrigger asChild onClick={() => setOpen(!open)}>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              setOpen(false);
              setOpenEditGroup(true);
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setOpenLeaveGroup(true)}
            className="text-red-500 focus:text-red-600"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Leave the group
          </DropdownMenuItem>
        </DropdownMenuContent>
        <LeaveGroupAlertDialog
          groupId={group.id}
          open={openLeaveGroup}
          onClose={() => setOpenLeaveGroup(false)}
        />
        <EditGroup group={group} onClose={() => setOpenEditGroup(false)} />
      </DropdownMenu>
    </Dialog>
  );
};

export default DropdownParameters;
