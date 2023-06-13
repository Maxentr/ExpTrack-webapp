"use client";

import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const GroupsLoading = () => (
  <>
    {Array(5).map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-full" />
          </CardTitle>
        </CardHeader>
      </Card>
    ))}
  </>
);

export default GroupsLoading;
