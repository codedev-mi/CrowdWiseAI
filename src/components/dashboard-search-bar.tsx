"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DashboardSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  isSearching: boolean;
}

export function DashboardSearchBar({
  searchQuery,
  onSearchChange,
  onClearSearch,
  isSearching,
}: DashboardSearchBarProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="relative group flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          type="search"
          placeholder="Search alerts, reports, routes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10 h-10 bg-muted/50 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
        />
        {isSearching && (
          <button
            onClick={onClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
