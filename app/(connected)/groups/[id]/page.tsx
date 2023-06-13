import GroupDetails from "@/app/(connected)/groups/[id]/GroupDetails";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type GenericSearchParams<T extends SearchParamsTab> = {
  tab: T;
};

interface DashboardSearchParams<T extends "dashboard">
  extends GenericSearchParams<T> {
}

interface MembersSearchParams<T extends "members">
  extends GenericSearchParams<T> {}

interface ExpensesSearchParams<T extends "expenses">
  extends GenericSearchParams<T> {
    expenseId?: string;
  }

export type SearchParams<T> = T extends "dashboard"
  ? DashboardSearchParams<T>
  : T extends "members"
  ? MembersSearchParams<T>
  : T extends "expenses"
  ? ExpensesSearchParams<T>
  : never;

export const SearchParamsTab = {
  dashboard: "dashboard",
  members: "members",
  expenses: "expenses",
} as const;

export type SearchParamsTab =
  (typeof SearchParamsTab)[keyof typeof SearchParamsTab];

type Params<T> = {
  params: { id: string };
  searchParams: SearchParams<T>;
};

export default function Page<T extends keyof SearchParamsTab>({
  params,
  searchParams,
}: Params<T>) {

  return (
    <>
      <Link href="/groups">
        <Button className="mb-4">
          <ArrowLeft className="w-6 h-6 mr-2" />
          My groups
        </Button>
      </Link>
      <GroupDetails groupId={+params.id} searchParams={searchParams} />
    </>
  );
}
