"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
});

type Props = {
  onSubmit: (email: string) => void;
};

const AddMember = ({ onSubmit }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const beforeOnSubmit = async (values: z.infer<typeof formSchema>) => {
    onSubmit(values.email);
    form.reset();
  };

  return (
    <Form {...form}>
      <div className="flex flex-row gap-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-4/12">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="button"
          onClick={form.handleSubmit(beforeOnSubmit)}
          className="mt-8"
        >
          Add member
        </Button>
      </div>
    </Form>
  );
};

export default AddMember;
