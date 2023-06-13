"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { HttpStatusCode } from "axios";
import { Plus } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
import { z } from "zod";

type Props = {
  groupId: number;
};

const AddMember = ({ groupId }: Props) => {
  const [open, setOpen] = React.useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  return (
    <>
      <Button onClick={onOpen}>
        <Plus className="h-4 w-4 mr-2" />
        Add a member
      </Button>
      <AddMemberDialog open={open} onClose={onClose} groupId={groupId} />
    </>
  );
};

type AddMemberDialogProps = {
  open: boolean;
  onClose: () => void;
  groupId: number;
};
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
});
const AddMemberDialog = ({ open, onClose, groupId }: AddMemberDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/groups/${groupId}/invite/${values.email}`,
    );

    if (response.status === HttpStatusCode.Ok) {
      toast({
        title: "Member added",
        description: "The member has been added to the group.",
      });
      mutate(`${process.env.NEXT_PUBLIC_API_URL}/v1/groups/${groupId}/members`);
    }
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add a member</DialogTitle>
              <DialogDescription>
                Add a member to your group by entering their email address.
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="submit">Add member</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMember;
