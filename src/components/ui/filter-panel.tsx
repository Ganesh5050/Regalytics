import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";

export interface FilterOption {
  key: string;
  label: string;
  type: "text" | "select" | "date" | "number";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface FilterValue {
  key: string;
  value: string | Date | number | undefined;
}

export interface FilterPanelProps {
  filters: FilterOption[];
  values: FilterValue[];
  onValuesChange: (values: FilterValue[]) => void;
  onClearAll: () => void;
  className?: string;
}

export function FilterPanel({
  filters,
  values,
  onValuesChange,
  onClearAll,
  className,
}: FilterPanelProps) {
  const updateFilter = (key: string, value: string | Date | number | undefined) => {
    const newValues = values.filter((v) => v.key !== key);
    if (value !== undefined && value !== "") {
      newValues.push({ key, value });
    }
    onValuesChange(newValues);
  };

  const removeFilter = (key: string) => {
    const newValues = values.filter((v) => v.key !== key);
    onValuesChange(newValues);
  };

  const getFilterValue = (key: string) => {
    return values.find((v) => v.key === key)?.value;
  };

  const renderFilter = (filter: FilterOption) => {
    const currentValue = getFilterValue(filter.key);

    switch (filter.type) {
      case "text":
        return (
          <Input
            placeholder={filter.placeholder || `Filter by ${filter.label}`}
            value={currentValue as string || ""}
            onChange={(e) => updateFilter(filter.key, e.target.value)}
          />
        );
      
      case "number":
        return (
          <Input
            type="number"
            placeholder={filter.placeholder || `Filter by ${filter.label}`}
            value={currentValue as number || ""}
            onChange={(e) => updateFilter(filter.key, e.target.value ? Number(e.target.value) : undefined)}
          />
        );
      
      case "select":
        return (
          <Select
            value={currentValue as string || ""}
            onValueChange={(value) => updateFilter(filter.key, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={filter.placeholder || `Select ${filter.label}`} />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case "date":
        return (
          <DatePicker
            date={currentValue as Date}
            onDateChange={(date) => updateFilter(filter.key, date)}
            placeholder={filter.placeholder || `Select ${filter.label}`}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filters</h3>
        {values.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear all
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filters.map((filter) => (
          <div key={filter.key} className="space-y-2">
            <Label htmlFor={filter.key}>{filter.label}</Label>
            {renderFilter(filter)}
          </div>
        ))}
      </div>
      
      {values.length > 0 && (
        <div className="space-y-2">
          <Label>Active Filters</Label>
          <div className="flex flex-wrap gap-2">
            {values.map((filterValue) => {
              const filter = filters.find((f) => f.key === filterValue.key);
              if (!filter) return null;
              
              const displayValue = filterValue.value instanceof Date
                ? filterValue.value.toLocaleDateString()
                : String(filterValue.value);
              
              return (
                <Badge key={filterValue.key} variant="secondary" className="flex items-center gap-1">
                  {filter.label}: {displayValue}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => removeFilter(filterValue.key)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
