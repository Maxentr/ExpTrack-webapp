import * as React from "react";

import { cn } from "@/lib/utils";

interface ErrorProps extends React.PropsWithChildren<unknown> {
  className?: string;
}

const Error = React.forwardRef<HTMLParagraphElement, ErrorProps>(
  ({ className, children }) => {
    return (
      <p className={cn("text-red-500 text-sm font-medium leading-none", className)}>
        {children}
      </p>
    );
  },
);
Error.displayName = "Error";

export { Error };
