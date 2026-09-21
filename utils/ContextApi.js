import React, { createContext, useState } from "react";
export const MyContext = createContext();
export const MyProvider = ({ children }) => {
  const [langu, setLangu] = useState("bn");

  return (
    <MyContext.Provider value={{ langu, setLangu }}>
      {children}
    </MyContext.Provider>
  );
};
