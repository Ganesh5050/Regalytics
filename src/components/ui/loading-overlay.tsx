import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export interface LoadingOverlayProps {
  loading: boolean;
  text?: string;
  className?: string;
  children?: React.ReactNode;
}

export function LoadingOverlay({ loading, text, className, children }: LoadingOverlayProps) {
  if (!loading) {
    return <>{children}</>;
  }

  return (
    <div className={cn("relative", className)}>
      {children}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          {text && <p className="text-sm text-muted-foreground">{text}</p>}
        </div>
      </div>
    </div>
  );
}
