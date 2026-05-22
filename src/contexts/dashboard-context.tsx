"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Alert } from "@/lib/types";

interface DashboardContextType {
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
  onSearch?: (query: string) => void;
  searchResults?: any[];
  isSearchModalOpen?: boolean;
  setSearchModalOpen?: (open: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = React.useState<Alert[]>([]);
  const [onSearch, setOnSearch] = React.useState<((query: string) => void) | undefined>();
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = React.useState(false);

  return (
    <DashboardContext.Provider
      value={{
        alerts,
        setAlerts,
        onSearch,
        searchResults,
        isSearchModalOpen,
        setSearchModalOpen: setIsSearchModalOpen,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (!context) {
    return {
      alerts: [],
      setAlerts: () => {},
      onSearch: undefined,
      searchResults: [],
      isSearchModalOpen: false,
      setSearchModalOpen: () => {},
    };
  }
  return context;
}
