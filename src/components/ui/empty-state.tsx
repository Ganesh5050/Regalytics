import * as React from "react";
import { FileX, Search, AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  variant?: "default" | "search" | "error";
}

const iconVariants = {
  default: FileX,
  search: Search,
  error: AlertCircle,
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  variant = "default",
}: EmptyStateProps) {
  const IconComponent = iconVariants[variant];
  const displayIcon = icon || <IconComponent className="h-12 w-12 text-muted-foreground" />;

  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      <div className="mb-4">
        {displayIcon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
}
