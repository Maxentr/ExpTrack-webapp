"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CustomExpenseMember, ExpenseMember, User } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  userId: z.number().int(),
});

type Props = {
  onSubmit: (member: CustomExpenseMember) => void;
  amountPerMember: number;
  members: User[];
};

const AddMemberWhoHaveToPayBack = ({
  onSubmit,
  amountPerMember,
  members,
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: undefined,
    },
  });

  const getMember = (id: number) => {
    const member = members.find((m) => m.id === id);
    return member;
  };

  const getMemberLabel = (id: number) => {
    const member = getMember(id);
    return member?.firstName + " " + member?.lastName;
  };

  const beforeOnSubmit = async (values: z.infer<typeof formSchema>) => {
    const member = getMember(values.userId);
    if (!member) return;

    onSubmit({
      ...member,
      amount: amountPerMember,
      expenseMemberId: 0,
      hasPaid: false,
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <div className="flex flex-row gap-2">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full max-w-[280px]">
              <FormLabel>Member</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? getMemberLabel(field.value)
                        : "Select a member"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0">
                  <Command>
                    <CommandInput placeholder="Search member..." />
                    <CommandEmpty>No member found.</CommandEmpty>
                    <CommandGroup>
                      {members.map((member) => (
                        <CommandItem
                          value={`${member.id}:::${member.firstName} ${member.lastName}`}
                          key={member.id}
                          onSelect={(value) => {
                            form.setValue("userId", +value.split(":::")[0]);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              member.id === field.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {member.firstName} {member.lastName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="button"
          onClick={form.handleSubmit(beforeOnSubmit)}
          className="mt-[22px]"
        >
          Add member
        </Button>
      </div>
    </Form>
  );
};

export default AddMemberWhoHaveToPayBack;
