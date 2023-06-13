"use client";

import { Button } from "@/components/ui/button";
import {
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
import { Group } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { HttpStatusCode } from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
import { z } from "zod";

type Props = {
  group: Group;
  onClose: () => void;
};
const formSchema = z.object({
  name: z.string().min(2, "Please enter a valid email."),
});
const EditGroup = ({ onClose, group }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: group.name,
    },
  });

  useEffect(() => {
    form.reset();
    form.setValue("name", group.name);
  }, [group]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/groups/${group.id}`,
      {
        name: values.name,
      },
    );

    if (response.status === HttpStatusCode.Ok) {
      toast({
        title: "Group updated",
        description: "The group has been updated.",
      });
      mutate(`${process.env.NEXT_PUBLIC_API_URL}/v1/groups/${group.id}`);
    }
    form.reset();
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Update group</DialogTitle>
            <DialogDescription>Update the group name.</DialogDescription>
          </DialogHeader>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="mt-4">
            <Button type="submit">Update group</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default EditGroup;
