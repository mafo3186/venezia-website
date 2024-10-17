import { createContext, PropsWithChildren, useContext } from "react";

const DebugContext = createContext<boolean>(false);

export const useDebug = () => useContext(DebugContext) ?? false;

export const DebugProvider = ({
  debug,
  children,
}: PropsWithChildren<{ debug: boolean }>) => {
  return (
    <DebugContext.Provider value={debug}>{children}</DebugContext.Provider>
  );
};
