import { useAuth } from "@clerk/remix";
import { useFetcher } from "@remix-run/react";
import React, { useEffect, useMemo, useState } from "react";

const AdminContext = React.createContext<{
  isAdmin: boolean;
}>({ isAdmin: false });

function AdminContextProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const fetcher = useFetcher();
  useEffect(() => {
    fetcher.load("/is_user_admin");
  }, [userId]);

  const isAdmin = useMemo(
    () => fetcher.data?.isAdmin ?? false,
    [fetcher.data?.isAdmin]
  );

  return (
    <AdminContext.Provider value={{ isAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export { AdminContext, AdminContextProvider };
