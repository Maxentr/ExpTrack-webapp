import { fetcher } from "@/lib/utils";
import Create from "./Create";
import useSWR from "swr";
import { ExpenseCategory, User } from "@/types/api";
import axios from "axios";

type Params = {
  params: { id: number };
};

const getExpensesCategories = async () => {
  const { data } = await axios.get<ExpenseCategory[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/expenses-categories`,
  );
  return data;
};

const getGroupMembers = async (groupId: number) => {
  const { data } = await axios.get<User[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/groups/${groupId}/members`,
  );
  return data;
};

export default async function Page({ params }: Params) {
  const categories = await getExpensesCategories();
  const members = await getGroupMembers(params.id);

  return (
    <Create
      groupId={params.id}
      categories={categories || []}
      members={members || []}
    />
  );
}
