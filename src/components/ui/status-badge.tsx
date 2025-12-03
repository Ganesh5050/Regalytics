import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        pending: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        published: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        archived: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  status?: string;
}

function StatusBadge({ className, variant, status, children, ...props }: StatusBadgeProps) {
  // Auto-determine variant based on status if not provided
  const getVariant = (status: string | undefined) => {
    if (variant) return variant;
    
    if (!status) return "default";
    
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes("success") || statusLower.includes("completed") || statusLower.includes("active")) {
      return "success";
    }
    if (statusLower.includes("warning") || statusLower.includes("pending") || statusLower.includes("draft")) {
      return "warning";
    }
    if (statusLower.includes("error") || statusLower.includes("failed") || statusLower.includes("cancelled")) {
      return "error";
    }
    if (statusLower.includes("info") || statusLower.includes("published")) {
      return "info";
    }
    if (statusLower.includes("inactive") || statusLower.includes("archived")) {
      return "inactive";
    }
    
    return "default";
  };

  return (
    <div
      className={cn(statusBadgeVariants({ variant: getVariant(status) }), className)}
      {...props}
    >
      {children || status}
    </div>
  );
}

export { StatusBadge, statusBadgeVariants };
