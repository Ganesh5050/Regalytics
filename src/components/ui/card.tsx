import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "rounded-[16px] sm:rounded-[20px] bg-[rgb(245,245,245)] text-card-foreground transition-all w-full",
      "shadow-[rgba(0,0,0,0.08)_0px_0.706592px_0.706592px_-0.666667px,rgba(0,0,0,0.08)_0px_1.80656px_1.80656px_-1.33333px,rgba(0,0,0,0.07)_0px_3.62176px_3.62176px_-2px,rgba(0,0,0,0.07)_0px_6.8656px_6.8656px_-2.66667px,rgba(0,0,0,0.05)_0px_13.6468px_13.6468px_-3.33333px,rgba(0,0,0,0.02)_0px_30px_30px_-4px,rgb(255,255,255)_0px_3px_1px_0px_inset]",
      "hover:shadow-[rgba(0,0,0,0.1)_0px_0.706592px_0.706592px_-0.666667px,rgba(0,0,0,0.1)_0px_1.80656px_1.80656px_-1.33333px,rgba(0,0,0,0.09)_0px_3.62176px_3.62176px_-2px,rgba(0,0,0,0.09)_0px_6.8656px_6.8656px_-2.66667px,rgba(0,0,0,0.07)_0px_13.6468px_13.6468px_-3.33333px,rgba(0,0,0,0.04)_0px_30px_30px_-4px,rgb(255,255,255)_0px_3px_1px_0px_inset]",
      className
    )} 
    {...props} 
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
<<<<<<< HEAD
    <div ref={ref} className={cn("flex flex-col space-y-2 p-4 sm:p-6", className)} {...props} />
=======
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
>>>>>>> c68809e0b25b1283df18d4277096f17da796c305
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
<<<<<<< HEAD
    <h3 ref={ref} className={cn("text-lg sm:text-xl font-semibold leading-tight tracking-tight text-blue-600", className)} {...props} />
=======
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
>>>>>>> c68809e0b25b1283df18d4277096f17da796c305
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
<<<<<<< HEAD
    <p ref={ref} className={cn("text-xs sm:text-sm text-blue-600/70 leading-relaxed", className)} {...props} />
=======
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
>>>>>>> c68809e0b25b1283df18d4277096f17da796c305
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
<<<<<<< HEAD
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-4 sm:p-6 pt-0", className)} {...props} />,
=======
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
>>>>>>> c68809e0b25b1283df18d4277096f17da796c305
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
<<<<<<< HEAD
    <div ref={ref} className={cn("flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-4 sm:p-6 pt-0", className)} {...props} />
=======
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
>>>>>>> c68809e0b25b1283df18d4277096f17da796c305
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
