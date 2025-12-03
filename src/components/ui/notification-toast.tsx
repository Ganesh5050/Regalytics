import * as React from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface NotificationToastProps {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const typeIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertCircle,
  info: Info,
};

const typeStyles = {
  success: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300",
  error: "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
  info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
};

export function NotificationToast({
  id,
  title,
  description,
  type = "info",
  onClose,
  action,
}: NotificationToastProps) {
  const IconComponent = typeIcons[type];

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div
      className={cn(
        "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg transition-all",
        typeStyles[type]
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium">{title}</p>
            {description && (
              <p className="mt-1 text-sm opacity-90">{description}</p>
            )}
            {action && (
              <div className="mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={action.onClick}
                  className="text-xs"
                >
                  {action.label}
                </Button>
              </div>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onClose(id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
