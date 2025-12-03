import * as React from "react";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface SearchBarProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showClearButton?: boolean;
}

export function SearchBar({
  value,
  onValueChange,
  placeholder = "Search...",
  className,
  showClearButton = true,
}: SearchBarProps) {
  const handleClear = () => {
    onValueChange("");
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="pl-10 pr-10"
      />
      {showClearButton && value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-transparent"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
