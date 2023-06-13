"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import React, { ComponentType, useEffect } from "react";

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
): React.FC<P> => {
  // eslint-disable-next-line react/display-name
  return (props: unknown) => {
    const { connectedUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!connectedUser) {
        router.replace("/");
      }
    }, [connectedUser, router]);

    if (connectedUser) {
      return <WrappedComponent {...(props as P)} />;
    } else {
      return null;
    }
  };
};

export default withAuth;
