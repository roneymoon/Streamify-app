"use client";

import React, { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";


export const SearchBar = ({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex items-center px-4 h-12 w-full max-w-md rounded-full bg-background border border-border shadow-sm focus-within:shadow-md transition">
      <Search className="w-5 h-5 text-primary mr-2" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent outline-none text-accent placeholder-muted-foreground text-sm"
      />
      {value && (
        <button onClick={onClear} className="ml-2">
          <X className="w-5 h-5 text-muted-foreground hover:text-primary" />
        </button>
      )}
    </div>
  );
};
