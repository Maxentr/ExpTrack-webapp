"use client";

import AddMemberWhoHaveToPayBack from "@/app/(connected)/groups/[id]/create-expense/AddMemberWhoHaveToPayBack";
import ExpensesMembers from "@/components/ExpensesMembers";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { CustomExpenseMember, ExpenseCategory, User } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { HttpStatusCode } from "axios";
import { ArrowLeft, Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  date: z.date(),
  amount: z.number().int(),
  groupId: z.number().int(),
  categoryId: z.number().int(),
  paidBy: z.number().int(),
  members: z
    .array(z.object({ id: z.number().int(), hasPaid: z.boolean() }))
    .optional(),
});

type Props = {
  groupId: number;
  categories: ExpenseCategory[];
  members: User[];
};

const Create = ({ groupId, categories, members }: Props) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: undefined,
      description: undefined,
      date: new Date(),
      amount: undefined,
      groupId: +groupId,
      categoryId: undefined,
      paidBy: undefined,
      members: [],
    },
  });

  const [expenseMembers, setExpenseMembers] = useState<CustomExpenseMember[]>(
    [],
  );

  const membersWithoutPayerAndSelected = members.filter(
    (m) =>
      m.id !== form.watch("paidBy") &&
      !expenseMembers.find((m2) => m2.id === m.id),
  );

  const amountPerMemberForCreate =
    ((form.watch("amount") || 0) / (expenseMembers.length + 2)) * 100;

  useEffect(() => {
    // if paidBy change filter expenseMembers to remove the payer
    setExpenseMembers((prev) =>
      prev.filter((m) => m.id !== form.watch("paidBy")),
    );
  }, [form.watch("paidBy")]);

  useEffect(() => {
    // if expenseMembers change, update the amount per member
    const amountPerMember =
      ((form.watch("amount") || 0) / (expenseMembers.length + 1)) * 100;
    setExpenseMembers((prev) =>
      prev.map((m) => ({
        ...m,
        amount: amountPerMember,
      })),
    );
  }, [form.watch("amount"), expenseMembers.length]);

  const getPaidByLabel = (id: number) => {
    const member = members.find((m) => m.id === id);
    return member?.firstName + " " + member?.lastName;
  };

  const beforeSubmit = () => {
    const expenseMembersIds = expenseMembers.map((m) => {
      return {
        id: m.id,
        hasPaid: m.hasPaid,
      };
    });

    return expenseMembersIds;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const members = beforeSubmit();

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/expenses`,
      {
        ...values,
        members,
        amount: +values.amount * 100,
      },
    );

    if (response.status === HttpStatusCode.Created) {
      toast({
        title: "Expense created",
        description: "The expense has been created successfully.",
        duration: 5000,
      });
      router.back();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Button className="w-fit mb-4" onClick={() => router.back()}>
        <ArrowLeft className="w-6 h-6 mr-2" />
        Go back
      </Button>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}>
          <div className="flex flex-row justify-between mb-2">
            <h2 className="text-2xl font-bold">New expense</h2>
            <Button type="submit">Create the expense</Button>
          </div>
          <div className="flex-1 flex flex-col gap-2 max-w-xl">
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
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="my-4 flex flex-col md:flex-row items-end gap-4 justify-between">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="flex flex-row items-center gap-2">
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                          min={0}
                        />
                        <span className="text-muted-foreground">$</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paidBy"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full max-w-[280px]">
                    <FormLabel>Paid by</FormLabel>
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
                              ? getPaidByLabel(field.value)
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
                                  form.setValue(
                                    "paidBy",
                                    +value.split(":::")[0],
                                  );
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
            </div>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="w-[280px]">
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      onChange={(date) => field.onChange(date)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col mt-1 w-[280px]">
                  <FormLabel>Category</FormLabel>
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
                            ? categories.find(
                                (category) => category.id === field.value,
                              )?.name
                            : "Select a category"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-0">
                      <Command>
                        <CommandInput placeholder="Search category..." />
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                          {categories.map((category) => (
                            <CommandItem
                              value={`${category.id}:::${category.name}`}
                              key={category.id}
                              onSelect={(value) => {
                                form.setValue(
                                  "categoryId",
                                  +value.split(":::")[0],
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  category.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {category.name}
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

            <h3 className="text-base font-bold mt-6">
              Split the expense between members
            </h3>
            <AddMemberWhoHaveToPayBack
              onSubmit={(member) =>
                setExpenseMembers((prev) => [...prev, member])
              }
              amountPerMember={amountPerMemberForCreate}
              members={membersWithoutPayerAndSelected}
            />
            <ExpensesMembers
              members={expenseMembers}
              onChange={({ members }) => setExpenseMembers(members)}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Create;
