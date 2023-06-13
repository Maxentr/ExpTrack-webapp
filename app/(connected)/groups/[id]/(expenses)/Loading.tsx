"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ExpensesSkeleton = () => (
  <>
    {Array(5).map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-full" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-6 w-full" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3 w-full" />
        </CardContent>
      </Card>
    ))}
  </>
);

export default ExpensesSkeleton;
