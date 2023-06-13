"use client";

import { Group } from "@/types/api";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { Suspense } from "react";
import GroupsLoading from "./Loading";

const Groups = () => {
  const { connectedUser } = useAuth();
  const {
    data: groups,
    error,
    mutate,
  } = useSWR<Group[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/groups/user/${connectedUser?.id}`,
    fetcher,
    { suspense: true },
  );

  return (
    <Suspense fallback={<GroupsLoading />}>
      {groups && groups.length > 0 ? (
        groups?.map((group) => (
          <Link href={`/groups/${group.id}`} key={group.id}>
            <Card>
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))
      ) : (
        <NoGroups />
      )}
    </Suspense>
  );
};

const NoGroups = () => {
  return (
    <div className="flex flex-1 flex-col justify-center text-center gap-4">
      <div>
        <p className="text-lg text-primary text-bold">
          You don&apos;t have any groups yet.
        </p>
        <p className="text-lg text-primary text-bold">
          You can create one or be invited to one.
        </p>
      </div>

      <Link href="/groups/create">
        <Button className="bg-primary">Create a group</Button>
      </Link>
    </div>
  );
};

export default Groups;
