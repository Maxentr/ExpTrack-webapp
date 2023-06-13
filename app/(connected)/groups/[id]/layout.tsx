"use client";

import { PropsWithChildren } from "react";

const GroupLayout = ({ children }: PropsWithChildren) => {

  return (
    <div className="p-16 flex-1 flex flex-col">
      {children}
    </div>
  );
};

export default GroupLayout;
