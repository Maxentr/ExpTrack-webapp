"use client";

import AddMember from "./AddMember";
import ListMembers from "./ListMembers";
import { Button } from "@/components/ui/button";
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
import { useAuth } from "@/lib/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { HttpStatusCode } from "axios";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

const Create = () => {
  const { connectedUser } = useAuth();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const [members, setMembers] = useState<string[]>([
    connectedUser?.email as string,
  ]);

  const onDelete = (id: number) => {
    setMembers((prev) => prev.filter((_, index) => index !== id));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/groups`,
      {
        name: values.name,
        members,
      },
    );

    if (response.status === HttpStatusCode.Created) {
      toast({
        title: "Group created",
        description:
          "Your group has been created. You can now add expenses to it.",
        duration: 5000,
      });
      mutate(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/groups/user/${connectedUser?.id}`,
      );
      router.push("/groups");
    }
  };

  return (
    <div className="p-16 flex-1 flex flex-col">
      <Link href="/groups">
        <Button className="mb-4">
          <ArrowLeft className="w-6 h-6 mr-2" />
          Go back
        </Button>
      </Link>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-row justify-between mb-2">
            <h2 className="text-2xl font-bold">New group</h2>
            <Button type="submit">Create the group</Button>
          </div>
          <div className="flex-1 flex flex-col gap-2">
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
            <h3 className="text-base font-bold mt-6">Members</h3>
            <AddMember
              onSubmit={(email) => setMembers((prev) => [...prev, email])}
            />
            <ListMembers members={members} onDelete={onDelete} />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Create;
