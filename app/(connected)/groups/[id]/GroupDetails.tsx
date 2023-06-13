"use client";

import { Group } from "@/types/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListMembers from "./(members)/ListMembers";
import DropdownParameters from "./(manage)/DropdownParameters";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import ListExpenses from "./(expenses)/ListExpenses";
import Dashboard from "./(dashboard)/Dashboard";
import { SearchParams, SearchParamsTab } from "./page";

type Props<T> = {
  groupId: number;
  searchParams: SearchParams<T>;
};

const GroupDetails = <T extends SearchParamsTab>({
  groupId,
  searchParams,
}: Props<T>) => {
  const {
    data: group,
    error,
    mutate,
  } = useSWR<Group>(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/groups/${groupId}`,
    fetcher,
    { suspense: true },
  );

  const defaultTab =
    SearchParamsTab[searchParams.tab || SearchParamsTab.dashboard] ||
    SearchParamsTab.dashboard;

  if (!group) return null;

  return (
    <>
      <div className="flex flex-row justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{group.name}</h2>
        <DropdownParameters group={group} />
      </div>
      <div className="flex-1 flex flex-col gap-2 p-2">
        <Tabs defaultValue={defaultTab} className="flex flex-col flex-1">
          <div className="flex flex-row items-center justify-between mb-4">
            <TabsList className="z-10 inline-flex w-fit">
              <TabsTrigger value={SearchParamsTab.dashboard}>
                Dashboard
              </TabsTrigger>
              <TabsTrigger value={SearchParamsTab.members}>Members</TabsTrigger>
              <TabsTrigger value={SearchParamsTab.expenses}>
                Expenses
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={SearchParamsTab.dashboard}>
            <Dashboard groupId={group.id} />
          </TabsContent>
          <TabsContent value={SearchParamsTab.members}>
            <ListMembers groupId={group.id} />
          </TabsContent>
          <TabsContent value={SearchParamsTab.expenses} className="flex flex-1">
            <ListExpenses
              groupId={group.id}
              selectedExpenseId={
                (searchParams as SearchParams<"expenses">)?.expenseId
              }
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default GroupDetails;
