import React, { useState } from "react";

const AdminContext = React.createContext<{
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}>({ isAdmin: false, setIsAdmin: () => {} });

function AdminContextProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export { AdminContext, AdminContextProvider };
